import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { RequestChecksumCalculation } from '@aws-sdk/middleware-flexible-checksums';
import { getToken } from 'next-auth/jwt';

// Get the access key and secret key from environment variables
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

// Ensure both keys are defined, or throw an error
if (!accessKeyId || !secretAccessKey) {
  throw new Error('R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be defined.');
}

const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT_S3_CLIENT, // R2 endpoint
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: 'auto', // Region (Cloudflare R2 uses auto)
  requestChecksumCalculation: RequestChecksumCalculation.WHEN_REQUIRED,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = (await formData.get('file')) as unknown as File;
  const fileName = String(formData.get('fileName'));
  const fileType = String(formData.get('fileType'));
  const action = String(formData.get('action'));

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.username) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'no-user-token',
    });
  }

  if (typeof token.expires === 'number' && token?.expires <= Date.now()) {
    return NextResponse.json({
      success: false,
      message: 'This action only available for authenticated user.',
      data: null,
      error: 'session-expired',
    });
  }

  if (action === 'server-upload-image') {
    return serverUploadImage({ file, fileName, fileType });
  }

  return NextResponse.json({
    success: false,
    message: 'Invalid action.',
    data: null,
    error: 'no-action-match',
  });
}

interface UploadImageType {
  file: File;
  fileName: string;
  fileType: string;
}

const serverUploadImage = async ({ file, fileName, fileType }: UploadImageType) => {
  try {
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'Invalid file',
        data: null,
        error: 'No such file',
      });
    }
    const params = {
      Bucket: 'apus-user-image', // Your R2 bucket name
      Key: fileName, // Object key (filename)
      ContentType: fileType, // Content Type (MIME type of the file)
    };

    const command = new PutObjectCommand(params);
    const uploadR2 = await s3Client.send(command);

    console.log('Upload data: ', {
      name: fileName,
      type: fileType,
      response: uploadR2,
    });

    return NextResponse.json({
      success: true,
      message: 'Pres-signed URL generated.',
      data: uploadR2,
      error: null,
    });
  } catch (error) {
    console.error('Error upload image: ', error);
    return NextResponse.json({
      success: false,
      message: 'Error uploading image.',
      data: null,
      error: error,
    });
  }
};
