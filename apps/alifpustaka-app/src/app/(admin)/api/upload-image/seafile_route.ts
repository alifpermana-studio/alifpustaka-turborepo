import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const config = { api: { bodyParser: false } };

const SEAFILE_API = 'https://storage.alifpustaka.net/api2';
const SEAFILE_USER = process.env.SEAFILE_USER;
const SEAFILE_PASS = process.env.SEAFILE_PASS;
const SEAFILE_REPO_ID = process.env.SEAFILE_REPO_ID;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = await formData.get('file');

  try {
    // 1. Auth
    const login = await axios.post(`${SEAFILE_API}/auth-token/`, {
      username: SEAFILE_USER,
      password: SEAFILE_PASS,
    });
    const token = login.data.token;

    console.log('Auth token: ', token);

    // 2. Get upload link
    const linkResp = await axios.get(`${SEAFILE_API}/repos/${SEAFILE_REPO_ID}/upload-link/`, {
      headers: { Authorization: `Token ${token}` },
    });
    const uploadLink = linkResp.data;

    console.log('Upload link: ', uploadLink);

    if (!file) {
      return;
    }

    const uploadForm = new FormData();
    uploadForm.append('file', file as File, 'ujicobapertama.jpg');
    uploadForm.append('parent_dir', '/');

    console.log('Upload data: ', uploadForm);

    const uploadResponse = await fetch(uploadLink, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: uploadForm,
    });

    console.log('Upload Response: ', uploadResponse);

    return NextResponse.json({
      success: true,
      data: uploadResponse,
      error: null,
    });
  } catch (error) {
    console.error('Error upload image: ', error);
    return NextResponse.json({
      success: false,
      data: null,
      error: error,
    });
  }
}
