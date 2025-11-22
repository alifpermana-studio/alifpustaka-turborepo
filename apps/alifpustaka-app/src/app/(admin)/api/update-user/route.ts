import { FormDataType, JWT, userOnAdminType } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { UserRole, Status, UserStatus } from '@repo/prisma-config';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.username && !token?.id) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'no-user-token',
    });
  } else if (typeof token.expires === 'number' && token?.expires <= Date.now()) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'session-expired',
    });
  } else {
    if (body.action === 'update-user-role') {
      return updateUserRole(token, body.data);
    } else if (body.action === 'reject-user-role') {
      return rejectUserRole(token, body.data);
    } else if (body.action === 'update-user-status') {
      return updateUserStatus(token, body.data);
    } else if (body.action === 'reject-user-status') {
      return rejectUserStatus(token, body.data);
    } else if (body.action === 'delete-user') {
      return deleteUser(token, body.data);
    } else if (body.action === 'report-user') {
      return reportUser(token, body.data);
    } else {
      return updateUser(token, body.data);
    }
  }
}

const updateUser = async (token: Partial<JWT>, formData: FormDataType) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: { username: token.username || '' },
    });

    if (findUser) {
      const updateSocial = Object.assign(findUser.social || {}, formData.social);
      const updateAddress = Object.assign(findUser.address || {}, formData.address);

      const usernameOnChange = findUser.username !== formData.username;
      const userRoleOnChange = formData.roleReq.reqUserRole !== findUser.userRole;
      const userStatusOnChange = formData.userStatus !== findUser.userStatus;

      let updateUsername = null;
      let reqUserRole = null;
      let reqUserStatus = null;

      if (usernameOnChange) {
        const isUsernameExist = await prisma.user.findUnique({
          where: { username: formData.username },
        });

        if (!isUsernameExist) {
          updateUsername = prisma.user.update({
            where: { id: findUser.id },
            data: { username: formData.username },
          });
        }
      }

      if (userRoleOnChange) {
        const findPendingRoleReq = await prisma.userRoleChangeReq.findFirst({
          where: {
            reqById: token.id,
            status: Status.PENDING,
          },
        });

        if (findPendingRoleReq) {
          reqUserRole = prisma.userRoleChangeReq.update({
            where: {
              id: findPendingRoleReq.id,
            },
            data: {
              reqById: findUser.id,
              reqUserRole: formData.roleReq.reqUserRole,
              reqMsg: formData.roleReq.reqMsg,
            },
          });
        } else {
          reqUserRole = prisma.userRoleChangeReq.create({
            data: {
              reqById: findUser.id,
              reqUserRole: formData.roleReq.reqUserRole,
              reqMsg: formData.roleReq.reqMsg,
            },
          });
        }
      }

      if (userStatusOnChange) {
        const findPendingStatusReq = await prisma.userStatusChangeReq.findFirst({
          where: {
            reqById: token.id,
            status: Status.PENDING,
          },
        });

        if (findPendingStatusReq) {
          reqUserStatus = prisma.userStatusChangeReq.update({
            where: {
              id: findPendingStatusReq.id,
            },
            data: {
              reqById: findUser.id,
              reqUserStatus: formData.statusReq.reqUserStatus,
              reqMsg: formData.statusReq.reqMsg,
            },
          });
        } else {
          reqUserStatus = prisma.userStatusChangeReq.create({
            data: {
              reqById: findUser.id,
              reqUserStatus: formData.statusReq.reqUserStatus,
              reqMsg: formData.statusReq.reqMsg,
            },
          });
        }
      }

      const result = await prisma.$transaction(
        async (prisma) => {
          const [userInfo, username, userRole, userStatus] = await Promise.all([
            prisma.user.update({
              where: { id: token.id },
              data: {
                fname: formData.fname ?? findUser.fname,
                lname: formData.lname ?? findUser.lname,
                address: updateAddress ?? findUser.address,
                emailVerified: formData.emailVerified ?? findUser.emailVerified,
                social: updateSocial ?? findUser.social,
                phone: formData.phone ?? findUser.phone,
                image: formData.image ?? findUser.image,
                bio: formData.bio ?? findUser.bio,
              },
            }),
            updateUsername,
            reqUserRole,
            reqUserStatus,
            ,
          ]);

          return { userInfo, username, userRole, userStatus };
        },
        {
          timeout: 600000, // Sets the timeout to 60 seconds (60000 milliseconds)
        },
      );

      console.log('Check update user: ', result);

      return NextResponse.json({
        success: true,
        message: 'Success update user data.',
        error: null,
        data: result,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Your user data not exist in our database. Please contact our administrator.',
        error: 'user-missing',
        data: null,
      });
    }
  } catch (error) {
    console.error('error-update-user-social: ', error);

    return NextResponse.json({
      success: false,
      message: 'Unknown error',
      data: null,
      error: {
        code: 500,
        type: 'unknown-error',
        details: 'Unknown error',
      },
    });
  }
};

const updateUserRole = async (token: Partial<JWT>, formData: userOnAdminType) => {
  try {
    if (token.userRole !== UserRole.SUPERADMIN && !token.id) {
      return NextResponse.json({
        success: false,
        message: 'This action only available for superadmin.',
        data: null,
        error: 'insufficient-role',
      });
    }

    const findUser = await prisma.user.findUnique({ where: { id: formData.id } });
    const findReq = await prisma.userRoleChangeReq.findUnique({
      where: { id: formData.roleReq.id || '' },
    });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found.',
        data: null,
        error: 'user-not-found',
      });
    }

    const updateUser = await prisma.user.update({
      where: { id: formData.id },
      data: {
        userRole: formData.roleReq.resUserRole,
      },
    });

    let updateRoleReq = null;

    if (findReq) {
      updateRoleReq = await prisma.userRoleChangeReq.update({
        where: { id: formData.roleReq.id },
        data: {
          resById: token.id,
          resUserRole: formData.roleReq.resUserRole,
          resMsg: formData.roleReq.resMsg,
          status:
            formData.roleReq.resUserRole === formData.roleReq.reqUserRole
              ? Status.APPROVED
              : Status.REJECTED,
        },
      });
    } else {
      updateRoleReq = await prisma.userRoleChangeReq.create({
        data: {
          reqById: formData.roleReq.id || '',
          resById: token.id,
          resUserRole: formData.roleReq.resUserRole,
          resMsg: formData.roleReq.resMsg,
          status: Status.APPROVED,
        },
      });
    }

    const result = await prisma.$transaction(async () => {
      const [handleUpdateUser, handleStatusReq] = await Promise.all([updateUser, updateRoleReq]);

      return { handleStatusReq, handleUpdateUser };
    });

    console.log('Check update user role: ', result);

    return NextResponse.json({
      success: true,
      message: 'Success update user role.',
      error: null,
      data: result,
    });
  } catch (error) {
    console.error('Error accept user role: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error accept user role.',
      data: null,
      error: 'error-accept-user-role',
    });
  }
};

const rejectUserRole = async (token: Partial<JWT>, formData: userOnAdminType) => {
  try {
    if (token.userRole !== UserRole.SUPERADMIN && !token.id) {
      return NextResponse.json({
        success: false,
        message: 'This action only available for superadmin.',
        data: null,
        error: 'insufficient-role',
      });
    }

    const findUser = await prisma.user.findUnique({ where: { id: formData.id } });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found.',
        data: null,
        error: 'user-not-found',
      });
    }

    if (!formData.roleReq) {
      return NextResponse.json({
        success: false,
        message: 'Reject action missing requirement object.',
        data: null,
        error: 'no-role-req',
      });
    }

    const rejectReq = await prisma.userRoleChangeReq.update({
      where: { id: formData.roleReq.id },
      data: {
        status: Status.REJECTED,
      },
    });

    if (rejectReq) {
      return NextResponse.json({
        success: true,
        message: 'Success reject user role.',
        data: 'success-reject-user-role',
        error: null,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed reject user role.',
        data: null,
        error: 'failed-reject-user-role',
      });
    }
  } catch (error) {
    console.error('Error reject user role: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error reject user role.',
      data: null,
      error: 'error-reject-user-role',
    });
  }
};

const updateUserStatus = async (token: Partial<JWT>, formData: userOnAdminType) => {
  try {
    if (token.userRole !== UserRole.SUPERADMIN && !token.id) {
      return NextResponse.json({
        success: false,
        message: 'This action only available for superadmin.',
        data: null,
        error: 'insufficient-role',
      });
    }

    const findUser = await prisma.user.findUnique({ where: { id: formData.id } });
    const findReq = await prisma.userStatusChangeReq.findUnique({
      where: { id: formData.statusReq.id || '' },
    });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found.',
        data: null,
        error: 'user-not-found',
      });
    }

    const updateUser = await prisma.user.update({
      where: { id: formData.id },
      data: {
        userStatus: formData.statusReq.resUserStatus,
      },
    });

    let updateStatusReq = null;

    if (findReq) {
      updateStatusReq = await prisma.userStatusChangeReq.update({
        where: { id: formData.roleReq.id },
        data: {
          resById: token.id,
          resUserStatus: formData.statusReq.resUserStatus,
          resMsg: formData.statusReq.resMsg,
          status:
            formData.statusReq.resUserStatus === formData.statusReq.reqUserStatus
              ? Status.APPROVED
              : Status.REJECTED,
        },
      });
    } else {
      updateStatusReq = await prisma.userStatusChangeReq.create({
        data: {
          reqById: formData.id,
          resById: token.id,
          resUserStatus: formData.statusReq.resUserStatus,
          resMsg: formData.statusReq.resMsg,
          status: Status.APPROVED,
        },
      });
    }

    const result = await prisma.$transaction(async () => {
      const [handleUpdateUser, handleStatusReq] = await Promise.all([updateUser, updateStatusReq]);

      return { handleStatusReq, handleUpdateUser };
    });

    console.log('Check update user status: ', result);

    return NextResponse.json({
      success: true,
      message: 'Success update user status.',
      error: null,
      data: result,
    });
  } catch (error) {
    console.error('Error accept user status: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error accept user status.',
      data: null,
      error: 'error-accept-user-status',
    });
  }
};

const rejectUserStatus = async (token: Partial<JWT>, formData: userOnAdminType) => {
  try {
    if (token.userRole !== UserRole.SUPERADMIN && !token.id) {
      return NextResponse.json({
        success: false,
        message: 'This action only available for superadmin.',
        data: null,
        error: 'insufficient-role',
      });
    }

    const findUser = await prisma.user.findUnique({ where: { id: formData.id } });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found.',
        data: null,
        error: 'user-not-found',
      });
    }

    if (!formData.statusReq) {
      return NextResponse.json({
        success: false,
        message: 'Reject action missing requirement object.',
        data: null,
        error: 'no-status-req',
      });
    }

    const rejectReq = await prisma.userStatusChangeReq.update({
      where: { id: formData.statusReq.id },
      data: {
        status: Status.REJECTED,
      },
    });

    if (rejectReq) {
      return NextResponse.json({
        success: true,
        message: 'Success reject user status.',
        data: 'success-reject-user-status',
        error: null,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed reject user status.',
        data: null,
        error: 'failed-reject-user-status',
      });
    }
  } catch (error) {
    console.error('Error reject user status: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error reject user status.',
      data: null,
      error: 'error-reject-user-status',
    });
  }
};

const deleteUser = async (token: Partial<JWT>, formData: userOnAdminType) => {
  try {
    if (token.userRole !== UserRole.SUPERADMIN && !token.id) {
      return NextResponse.json({
        success: false,
        message: 'This action only available for superadmin.',
        data: null,
        error: 'insufficient-role',
      });
    }

    const findUser = await prisma.user.findUnique({ where: { id: formData.id } });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found.',
        data: null,
        error: 'user-not-found',
      });
    }

    const updateUser = await prisma.user.update({
      where: { id: formData.id },
      data: {
        userStatus: UserStatus.DELETED,
      },
    });

    if (updateUser) {
      return NextResponse.json({
        success: true,
        message: 'Success delete user.',
        data: 'success-delete-user',
        error: null,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed delete user.',
        data: null,
        error: 'failed-delete-user',
      });
    }
  } catch (error) {
    console.error('Error delete user: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error delete user.',
      data: null,
      error: 'error-delete-user',
    });
  }
};

const reportUser = async (token: Partial<JWT>, formData: userOnAdminType) => {
  try {
    if (token.userRole !== UserRole.SUPERADMIN && !token.id) {
      return NextResponse.json({
        success: false,
        message: 'This action only available for superadmin.',
        data: null,
        error: 'insufficient-role',
      });
    }

    const findUser = await prisma.user.findUnique({ where: { id: formData.id } });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found.',
        data: null,
        error: 'user-not-found',
      });
    }

    const updateUser = await prisma.user.update({
      where: { id: formData.id },
      data: {
        userStatus: UserStatus.BANNED,
      },
    });

    if (updateUser) {
      return NextResponse.json({
        success: true,
        message: 'Success report user.',
        data: 'success-report-user',
        error: null,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed report user.',
        data: null,
        error: 'failed-report-user',
      });
    }
  } catch (error) {
    console.error('Error report user: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error report user.',
      data: null,
      error: 'error-report-user',
    });
  }
};
