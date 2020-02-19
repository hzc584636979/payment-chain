import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import moment from 'moment';
import OSS from 'ali-oss';
import { message } from 'antd';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = path => reg.test(path);

export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getRealNamePassed = () => {
  return g_getLocalStorage() ? g_getLocalStorage().real_name_passed : false;
}

export const formatMomentTime = data => {
  if(typeof data == 'number' || typeof data == 'string') {
    /*
    return [
      moment(data).startOf('day').local().format('YYYY-MM-DD HH:mm:ss'),
      moment().endOf('day').local().format('YYYY-MM-DD HH:mm:ss')
    ]  
    */
    return [
      moment(data).startOf('day').local().format('x'),
      moment().endOf('day').local().format('x')
    ]  
  }else if(typeof data == 'object') {
    /*
    return [
      data[0].local().format('YYYY-MM-DD HH:mm:ss'),
      data[1].local().format('YYYY-MM-DD HH:mm:ss')
    ]  
    */
    return [
      data[0].local().format('x'),
      data[1].local().format('x')
    ]  
  }
  /*
  return [
    moment().startOf('day').local().format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').local().format('YYYY-MM-DD HH:mm:ss')
  ]
  */
  return [
    moment().startOf('day').local().format('x'),
    moment().endOf('day').local().format('x')
  ]  
}

export const compressBase64 = (base64, callback, maxMB) => {
  let newImage = new Image();
  let quality = base64.length / maxMB < 0.9 ? base64.length / maxMB < 0.9 : 0.8;    //压缩系数0-1之间，压缩到0.9以上会有bug，注意！（可以自行设置）
  newImage.src = base64;
  let imgWidth, imgHeight;
  newImage.onload = function () {
    imgWidth = this.width;
    imgHeight = this.height;
    //给生成图片设置一个默认的最大宽/高（可以自行设置）
    let myWidth = 300;
    //准备在画布上绘制图片
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    //判断上传的图片的宽高是否超过设置的默认最大值，以及设置同比例的宽高
    if (Math.max(imgWidth, imgHeight) > myWidth) {
      if (imgWidth > imgHeight) {
        canvas.width = myWidth;
        canvas.height = myWidth * imgHeight / imgWidth;
      } else {
        canvas.height = myWidth;
        canvas.width = myWidth * imgWidth / imgHeight;
      }
    } else {
      canvas.width = imgWidth;
      canvas.height = imgHeight;
    }
    //清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //开始绘制图片到画布上
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    console.log(quality)
    let newBase64 = canvas.toDataURL("image/jpeg", quality);//压缩图片大小（重点代码）
    console.log(base64.length / 1024 / 1024, newBase64.length / 1024 / 1024)
    // 获取到当前的图片的大小，然后调整成自己需要的大小
    while (newBase64.length / 1024 / 1024 > maxMB) {
      quality -= 0.02;
      newBase64 = canvas.toDataURL("image/jpeg", quality);
    }
    callback(newBase64);
  }
}

function getCode(n) {
  var all = "azxcvbnmsdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP0123456789";
  var b = "";
  for (var i = 0; i < n; i++) {
    var index = Math.floor(Math.random() * 62);
    b += all.charAt(index);
  }
  return b;
};

const client = new OSS({
  region: 'oss-cn-beijing',
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAI4FsTLQKitdN1Ye9VD2Wm',
  accessKeySecret: 'H9VotwP7iACImD8EHL5lsM0sFTze8x',
  bucket: 'zhifulian'
});

export const getBase64 = (img, callback, maxMB) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  const suffix = img.type == 'image/png' ? 'png' : 'jpg';
  const fileName = getCode(4) + 'issue_file_' + new Date().getTime() + getCode(4) + '.' + suffix;

  async function put(img) {
    try {
      //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
      let result = await client.put(fileName, img);
      /*const expires = new Date(new Date().getTime() + 3600 * 1000 * 24 * 365 * 1000).getTime();
      let url = await client.signatureUrl(fileName, {expires});*/
      callback(result.url);
    } catch (e) {
      callback(null);
      message.error('上传失败，请重新上传', e);
      console.log(e);
    }
  }

  reader.addEventListener('load', () => {
    if(maxMB && reader.result.length / 1024 / 1024  > maxMB) {
      compressBase64(reader.result, (newBase64) => {
        const file = newBase64.replace(/^data:\w+\/\w+;base64,/, "");
        put(new OSS.Buffer(file, "base64"));
      }, maxMB);
      return;
    }
    const file = reader.result.replace(/^data:\w+\/\w+;base64,/, "");
    put(new OSS.Buffer(file, "base64"));
  });
}

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};
