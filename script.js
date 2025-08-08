// WheelFrictionCurveパラメーターの初期値
const params = {
    extremumSlip: 1.0,
    extremumValue: 5.0,
    asymptoteSlip: 2.0,
    asymptoteValue: 1.0,
    stiffness: 1.0,
};

// 各スライダーを取得
const sliders = {
    extremumSlip: document.getElementById('extremumSlip'),
    extremumValue: document.getElementById('extremumValue'),
    asymptoteSlip: document.getElementById('asymptoteSlip'),
    asymptoteValue: document.getElementById('asymptoteValue'),
    stiffness: document.getElementById('stiffness'),
};

// 値表示用
function updateValueLabels() {
    for (const key in sliders) {
        document.getElementById('v_' + key).innerText = parseFloat(params[key]).toFixed(2);
    }
}

// 曲線の摩擦力計算
function frictionCurve(slip) {
    const { extremumSlip, extremumValue, asymptoteSlip, asymptoteValue, stiffness } = params;
    let value = 0;
    if (slip < extremumSlip) {
        // 0〜extremumSlipまで直線補間（最大グリップに向かう）
        value = extremumValue * (slip / extremumSlip);
    } else if (slip < asymptoteSlip) {
        // extremumSlip〜asymptoteSlipでextremumValueからasymptoteValueへ直線補間
        value = extremumValue + (asymptoteValue - extremumValue) * ((slip - extremumSlip) / (asymptoteSlip - extremumSlip));
    } else {
        // asymptoteSlip以降はasymptoteValue
        value = asymptoteValue;
    }
    return value * stiffness;
}

// グラフ描画
function drawGraph() {
    const canvas = document.getElementById('frictionCurve');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 軸
    ctx.save();
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    // X軸
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(470, 300);
    ctx.stroke();
    // Y軸
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(50, 30);
    ctx.stroke();
    ctx.restore();

    // ラベル
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#555";
    ctx.fillText("摩擦力", 5, 50);
    ctx.fillText("スリップ量", 410, 320);

    // メモリ線
    for (let i = 0; i <= 10; i++) {
        let y = 300 - i * 27;
        ctx.strokeStyle = "#eee";
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(470, y);
        ctx.stroke();
        ctx.fillStyle = "#888";
        ctx.font = "11px sans-serif";
        ctx.fillText(i, 30, y + 3);
    }

    // パラメータガイド線
    const slipToX = slip => 50 + (slip / 3.0) * 400;
    ctx.strokeStyle = "#fa0";
    ctx.setLineDash([5, 3]);
    [params.extremumSlip, params.asymptoteSlip].forEach(slip => {
        ctx.beginPath();
        ctx.moveTo(slipToX(slip), 300);
        ctx.lineTo(slipToX(slip), 30);
        ctx.stroke();
    });
    ctx.setLineDash([]);

    // 摩擦曲線描画
    ctx.save();
    ctx.strokeStyle = "#1a7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
        const slip = (i / 400) * 3.0;
        const friction = frictionCurve(slip);
        const x = 50 + i;
        const y = 300 - Math.min(friction, 10) * 27;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // ガイド値
    ctx.fillStyle = "#f80";
    ctx.font = "12px sans-serif";
    ctx.fillText("extremumSlip", slipToX(params.extremumSlip) - 35, 320);
    ctx.fillText("asymptoteSlip", slipToX(params.asymptoteSlip) - 35, 335);
}

// スライダーイベント
for (const key in sliders) {
    sliders[key].addEventListener('input', e => {
        params[key] = parseFloat(e.target.value);
        updateValueLabels();
        drawGraph();
    });
}

// 初期化
updateValueLabels();
drawGraph();