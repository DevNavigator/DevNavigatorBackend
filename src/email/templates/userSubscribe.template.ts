export const userSubscriber = (userName) => {
  return `<html lang='es'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Bienvenido a DevNavigator</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #007bff;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class='container'>
          <h1>¡Felicitaciones!, ${userName}!</h1>
          <p>
            Ahora eres un suscriptor de <strong>DevNavigator</strong>.
          </p>
          <p>
            Gracias por unirte a nuestra comunidad. Estamos emocionados de que estés aquí y listos para comenzar tu viaje de aprendizaje.
          </p>
          <p>
            Como suscriptor, tendrás acceso a una variedad de recursos y cursos diseñados para ayudarte a mejorar tus habilidades de programación.
          </p>
          <p>
            Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Estamos aquí para apoyarte en cada paso de tu camino.
          </p>
          <p>¡Esperamos verte pronto en nuestros cursos!</p>
          <p>Atentamente,</p>
          <p><strong>El equipo de DevNavigator</strong></p>
          <div class='footer'>
            <p>&copy; 2024 DevNavigator. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
    `;
};
