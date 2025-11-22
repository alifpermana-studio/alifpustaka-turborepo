'use client';

type checkerType = {
  val: string;
  formData: userType;
};

type userType = {
  fname?: string;
  lname?: string;
  username?: string;
  email?: string;
  password?: string;
  rePassword?: string;
};

export function errorChecker(props: checkerType) {
  const regexGlobal = /[/+\=\@\$\|\^\~\[\]\{\}\`\#\%\*\_\<\>\,\.\"\'\(\)\?\!\:\;\/]/;
  const regexName = /[/+\=\@\$\|\^\~\<\>\,\.\"\'\(\)/]/;
  const regexUsername = /[/+\=\@\$\|\^\~\[\]\{\}\`\#\%\*\-\<\>\,\.\"\'\(\)\?\!\:\;\/\s]/;
  const regexEmail = /[/=\@\$\|\^\~\[\]\{\}\`\#\%\*\<\>\,\"\'\(\)\?\!\:\;\/]/;
  const regexUppercase = /[A-Z]/;
  const regexLowercase = /[a-z]/;
  const regexNumeric = /[0-9]/;

  if (props.val === 'fname') {
    if (regexName.test(props.formData.fname || '')) {
      return 'Enter your name correctly';
    }
  }

  if (props.val === 'lname') {
    if (regexName.test(props.formData.lname || '')) {
      return 'Enter your name correctly';
    }
  }

  if (props.val === 'username') {
    if (regexUsername.test(props.formData.username || '')) {
      return 'Only alphanumeric and underscore are allowed';
    }

    if (
      props.formData.username &&
      (props.formData.username.indexOf('-') === 0 ||
        props.formData.username.lastIndexOf('-') === props.formData.username.length - 1)
    ) {
      return 'Hyphens are not allowed on first or end username';
    }
  }

  if (props.val === 'email' && props.formData.email) {
    const emailUser = props.formData.email.slice(0, props.formData.email.indexOf('@'));
    const emailDomain = props.formData.email.slice(
      props.formData.email.indexOf('@') + 1,
      props.formData.email.length,
    );

    if (regexEmail.test(emailUser) || regexEmail.test(emailDomain)) {
      return 'Please enter a valid email address';
    } else if (
      emailUser.indexOf('-') === 0 ||
      emailUser.lastIndexOf('-') === emailUser.length - 1 ||
      emailUser.indexOf('_') === 0 ||
      emailUser.lastIndexOf('_') === emailUser.length - 1 ||
      emailUser.indexOf('+') === 0 ||
      emailUser.lastIndexOf('+') === emailUser.length - 1 ||
      emailUser.indexOf('@') === 0 ||
      emailUser.lastIndexOf('@') === emailUser.length - 1 ||
      emailUser.indexOf('.') === 0 ||
      emailUser.lastIndexOf('.') === emailUser.length - 1
    ) {
      return 'Please enter a valid email address';
    } else if (
      emailDomain.indexOf('-') === 0 ||
      emailDomain.lastIndexOf('-') === emailDomain.length - 1 ||
      emailDomain.indexOf('_') === 0 ||
      emailDomain.lastIndexOf('_') === emailDomain.length - 1 ||
      emailDomain.indexOf('+') === 0 ||
      emailDomain.lastIndexOf('+') === emailDomain.length - 1 ||
      emailDomain.indexOf('@') === 0 ||
      emailDomain.lastIndexOf('@') === emailDomain.length - 1 ||
      emailDomain.indexOf('.') === 0 ||
      emailDomain.lastIndexOf('.') === emailDomain.length - 1
    ) {
      return 'Please enter a valid email address';
    } else if (!props.formData.email.includes('@') || !props.formData.email.includes('.')) {
      return 'Please enter a valid email address';
    } else if (emailDomain.split('.')[emailDomain.split('.').length - 1].length < 2) {
      return 'Please enter a valid email address';
    }
  }

  if (props.val === 'password' && props.formData.password) {
    if (
      props.formData.password.indexOf(' ') === 0 ||
      props.formData.password.lastIndexOf('.') === props.formData.password.length - 1
    ) {
      return 'Password can not start or end with whitespace';
    }

    if (props.formData.password.length < 8) {
      return 'Password needs to be at least 8 characters';
    }

    if (
      !regexUppercase.test(props.formData.password) ||
      !regexLowercase.test(props.formData.password) ||
      !regexNumeric.test(props.formData.password)
    ) {
      return 'Password must contain alphanumeric with at least one uppercase and lowercase letter';
    }

    if (!regexGlobal.test(props.formData.password)) {
      return 'Password must contain at least one special character.';
    }
  }

  if (props.val === 'confirmPassword') {
    if (props.formData.password !== props.formData.rePassword) {
      return 'Passwords do not match';
    }
  }

  return '';
}
