import XLSX from 'xlsx';

let tmpDown; // 导出的二进制对象

// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
    let s = '';
    let m = 0;
    while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
    }
    return s
}

// 导出Excel公共部分
function excelCommon(data) {
    let tmpObj = data[0]; // 拿到数据的第一个对象
    data.unshift({}); // 在json内添加一个对象存放表格head
    let keyMap = []; // 定义一个数组存放表格的head
    // 循环json中拿到的对象目的是为了构建head
    for (var k in tmpObj) {
        keyMap.push(k); // 将对象中的key值存放到定义的数组中
        data[0][k] = k; // 将表头的内容以key/value的形式存放到json的空对象中
    };
    let tmpdata = []; // 用来保存转换好的json
    data.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k],
        position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
    }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
        v: v.v,
    });
    let outputPos = Object.keys(tmpdata); // 设置区域,比如表格从A1到D10
    return {
        outputPos,
        tmpdata
    }
}

// 字符串转字符流
function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

const exportExcel = (exportName, data) => {
    const type = "xlsx"; // 导出的格式这里写死为xlsx

    // 调取公共部分构建数据
    let upDataWCN = excelCommon(data);

    // 生成表格
    let tmpWB = {
        SheetNames: [exportName], // 保存的表标题
        Sheets: {
            [exportName] : Object.assign({},
                upDataWCN.tmpdata, // 表格内容
                {
                    '!ref': upDataWCN.outputPos[0] + ':' + upDataWCN.outputPos[upDataWCN.outputPos.length - 1] // 设置填充区域
                }),
        }
    };

    // 创建二进制对象写入转换好的字节流
    tmpDown = new Blob([s2ab(XLSX.write(tmpWB, 
        {bookType: (type === undefined ? 'xlsx':type),bookSST: false, type: 'binary'}// 这里是用来定义导出的格式类型
        ))], {
        type: ""
    }); 
    var href = URL.createObjectURL(tmpDown); // 创建对象超链接
    document.getElementById("hf").href = href; // 绑定a标签
    document.getElementById("hf").download = `${exportName}.xlsx`;
    document.getElementById("hf").click();
    setTimeout(function() { // 延时释放
        URL.revokeObjectURL(tmpDown); // 用URL.revokeObjectURL()来释放这个object URL
    }, 100);
}

export default exportExcel;