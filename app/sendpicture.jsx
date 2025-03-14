import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

// 1. 选择图片
const pickImage = async () => {
  const result = await launchImageLibrary({ mediaType: 'photo' });
  if (result.assets?.[0]) {
    return result.assets[0];
  }
  return null;
};

// 2. 上传图片（使用通用域名）
const uploadToQiniu = async (image, token) => {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    type: image.type || 'image/jpeg',
    name: image.fileName || `image_${Date.now()}.jpg`,
  });
  formData.append('token', token);

  try {
    const response = await axios.post('https://upload-z2.qiniup.com', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.key; // 返回七牛云的文件 key
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
};

// 3. 整合逻辑
const handleUpload = async () => {
  try {
    const image = await pickImage();
    if (!image) return;

    // 从后端获取 Token（确保后端生成 Token 时未限制区域）
    const token = await gettoken();

    // 上传
    const key = await uploadToQiniu(image, token);
    const imageUrl = `https://mini-project.muxixyz.com/${key}`;
    return imageUrl;
  } catch (error) {
    console.error('上传流程失败:', error);
  }
};
const gettoken = async () => {
  try {
    const token = await Get('/user/uploadphoto');
    return token.success;
  } catch (error) {
    console.error(error);
  }
};