// 汇率变量
let rmbToRbRate = 160; // 更新后的汇率：1亿RB = 160人民币
const rmbToMbRate = 100000 / 218; // 固定汇率：218人民币 = 100000MB（保持不变）
const rmbToThbRate = 473.8 / 100; // 固定汇率：100人民币 = 473.8泰铢（保持不变）

// 更新人民币和RB的汇率
document
  .getElementById("rmb-to-rb-rate")
  .addEventListener("input", function () {
    rmbToRbRate = parseFloat(this.value);
    convertCurrency();
  });

// 货币换算函数
function convertCurrency() {
  // 获取输入值
  const rmb = parseFloat(document.getElementById("rmb").value) || 0;
  const rb = parseFloat(document.getElementById("rb").value) || 0;
  const mb = parseFloat(document.getElementById("mb").value) || 0;
  const thb = parseFloat(document.getElementById("thb").value) || 0;

  // 计算其他货币的值
  if (rmb > 0) {
    // 输入人民币值
    document.getElementById("rb").value = (rmb * 1e8) / rmbToRbRate;
    document.getElementById("mb").value = rmb * rmbToMbRate;
    document.getElementById("thb").value = (rmb * rmbToThbRate).toFixed(2);
  } else if (rb > 0) {
    // 输入RB值
    document.getElementById("rmb").value = (rb * rmbToRbRate) / 1e8;
    document.getElementById("mb").value =
      ((rb * rmbToRbRate) / 1e8) * rmbToMbRate;
    document.getElementById("thb").value = (
      ((rb * rmbToRbRate) / 1e8) *
      rmbToThbRate
    ).toFixed(2);
  } else if (mb > 0) {
    // 输入MB值
    document.getElementById("rmb").value = mb / rmbToMbRate;
    document.getElementById("rb").value =
      ((mb / rmbToMbRate) * rmbToRbRate) / 1e8;
    document.getElementById("thb").value = (
      (mb / rmbToMbRate) *
      rmbToThbRate
    ).toFixed(2);
  } else if (thb > 0) {
    // 输入泰铢值
    document.getElementById("rmb").value = thb / rmbToThbRate;
    document.getElementById("rb").value =
      ((thb / rmbToThbRate) * rmbToRbRate) / 1e8;
    document.getElementById("mb").value = (
      (thb / rmbToThbRate) *
      rmbToMbRate
    ).toFixed(0);
  }
}
