export const usersUpdate = (userName, userUpdateAt) => {
  return `<html lang='es'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Actualización de Datos en DevNavigator</title>
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
            Te informamos que tus datos y/o contraseña han sido actualizados correctamente en <strong>DevNavigator</strong>.
          </p>
          <p>
            Fecha de la última actualización: <strong>${userUpdateAt}</strong>.
          </p>
          <p>
            Si fuiste tú quien autorizó este cambio, te recomendamos hacer caso omiso a este correo.
          </p>
          <p>
            Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Estamos aquí para apoyarte en cada paso de tu camino.
          </p>
          <p class='alert'>¡Atención! Si no reconoces esta actividad, considera cambiar tu contraseña lo antes posible.</p>
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
