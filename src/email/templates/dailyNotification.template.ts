export const dailysNotifications = (userName) => {
  return `<html lang='es'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Recordatorio de Conexión en DevNavigator</title>
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
          .alert {
            color: #d9534f; /* Color rojo para alertas */
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class='container'>
        <img src='https://res.cloudinary.com/dckxhsgw0/image/upload/v1731468835/wmfsmnyqqqfdjagifna6.png' alt='DevNavigator Logo' class='logo'>
          <h1>¡Hola, ${userName}!</h1>
          <p>
            Esperamos que estés disfrutando de tu experiencia en <strong>DevNavigator</strong>.
          </p>
          <p>
            Este es un recordatorio para que te conectes a la plataforma y sigas avanzando en tus cursos. No olvides que tu aprendizaje es importante y queremos ayudarte a alcanzar tus metas.
          </p>
          <p>
            Si has tenido dificultades para acceder a tu cuenta o necesitas asistencia, no dudes en contactarnos. Estamos aquí para apoyarte en tu camino educativo.
          </p>
          <p class='alert'>¡Atención! Si no has iniciado sesión en los últimos días, es posible que quieras revisar tu progreso y continuar con tus estudios.</p>
          <p>Gracias por ser parte de nuestra comunidad.</p>
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
