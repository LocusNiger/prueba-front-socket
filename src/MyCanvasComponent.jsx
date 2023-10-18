/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

const MyCanvasComponent = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Limpio el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el eje X
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 20);
    ctx.lineTo(canvas.width, canvas.height - 20);
    ctx.stroke();

    // Dibujar los valores del eje X
    for (let i = 0; i <= 101; i += 20) {
      ctx.fillText(i, (i / 105) * canvas.width, canvas.height - 5);
    }

    // Calcular la posición X del rectángulo
    const rectWidth = 200;
    const rectHeight = 200;
    const rectX = (data.value / 100) * (canvas.width - rectWidth);
    const rectY = canvas.height - 20 - rectHeight;
    const color = getColor(data.value);

    ctx.fillStyle = color;
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    // Mostrar la data dentro del rectángulo
    ctx.fillStyle = "white";
    ctx.font = "15px Montserrat";
    ctx.textAlign = "center";
    ctx.fillText(
      "NOMBRE: " + data.name,
      rectX + rectWidth / 2,
      rectY + rectHeight / 2 - 20
    );
    ctx.fillText(
      "VALOR: " + data.value,
      rectX + rectWidth / 2,
      rectY + rectHeight / 2
    );
    ctx.fillText(
      "ESTADO: " + data.status,
      rectX + rectWidth / 2,
      rectY + rectHeight / 2 + 20
    );
  }, [data]);

  const getColor = (value) => {
    // Mapea el valor a un gradiente de color (rojo a verde)
    const hue = (value / 100) * 120;
    const hueRange = 120;
    const minHue = 0; // Rojo
    const maxHue = 120; // Verde
    const hueValue = minHue + (hue / hueRange) * (maxHue - minHue);
    return `hsl(${hueValue}, 100%, 50%)`;
  };

  return <canvas ref={canvasRef} width={500} height={300} />;
};

export default MyCanvasComponent;
