const skills = [
  "T-SQL query tuning",
  "Microsoft SQL Server administration",
  "Azure Arc onboarding",
  "Azure Monitor alerting",
  "Nutanix NDB VM configuration",
  "Power BI and SSRS reporting",
  "ETL / ELT workflow design",
];

const typedSkill = document.querySelector("#typed-skill");
let skillIndex = 0;
let charIndex = 0;
let deleting = false;

function typeSkill() {
  if (!typedSkill) return;

  const current = skills[skillIndex];
  typedSkill.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    window.setTimeout(typeSkill, 58);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    window.setTimeout(typeSkill, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    window.setTimeout(typeSkill, 28);
    return;
  }

  deleting = false;
  skillIndex = (skillIndex + 1) % skills.length;
  window.setTimeout(typeSkill, 280);
}

typeSkill();

const canvas = document.querySelector("#data-flow");
const ctx = canvas?.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let nodes = [];
let animationFrame = 0;

function resizeCanvas() {
  if (!canvas || !ctx) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(34, Math.min(76, Math.floor(window.innerWidth / 18)));
  nodes = Array.from({ length: count }, (_, index) => ({
    x: (index * 97) % window.innerWidth,
    y: (index * 53) % window.innerHeight,
    vx: ((index % 7) - 3) * 0.055,
    vy: (((index + 3) % 9) - 4) * 0.045,
    r: 1.4 + (index % 4) * 0.45,
  }));
}

function drawFlow() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.lineWidth = 1;

  nodes.forEach((node, index) => {
    if (!reduceMotion.matches) {
      node.x += node.vx;
      node.y += node.vy;
    }

    if (node.x < -20) node.x = window.innerWidth + 20;
    if (node.x > window.innerWidth + 20) node.x = -20;
    if (node.y < -20) node.y = window.innerHeight + 20;
    if (node.y > window.innerHeight + 20) node.y = -20;

    for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
      const next = nodes[nextIndex];
      const dx = node.x - next.x;
      const dy = node.y - next.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 148) {
        const opacity = (1 - distance / 148) * 0.24;
        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
    }

    ctx.fillStyle = index % 5 === 0 ? "rgba(52, 211, 153, 0.75)" : "rgba(125, 211, 252, 0.66)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  });

  animationFrame = window.requestAnimationFrame(drawFlow);
}

if (canvas && ctx) {
  resizeCanvas();
  drawFlow();
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationFrame);
    resizeCanvas();
    drawFlow();
  });
}
