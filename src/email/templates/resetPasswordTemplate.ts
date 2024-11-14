export const resetPasswordTemplate = (userName, resetLink) => {
  return `<html lang='es'>
    <head>
      <meta charset='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <title>Restablecimiento de Contraseña en DevNavigator</title>
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
        .reset-link {
          display: inline-block;
          background-color: #4da6ff;
          color: #000;
          font-weight: bold;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin-top: 20px;
        }
        .reset-link:hover {
          background-color: #80c0ff;
        }
        .logo {
          display: block;
          margin: 0 auto 20px;
          max-width: 200px;
        }
      </style>
    </head>
    <body>
      <div class='container'>
        <img src='https://res.cloudinary.com/dckxhsgw0/image/upload/v1731468561/kad5psunnn3ws28v9vwl.png' alt='DevNavigator Logo' class='logo'>
        <h1>¡Hola, ${userName}!</h1>
        <p>
          Hemos recibido una solicitud para restablecer tu contraseña en <strong>DevNavigator</strong>.
        </p>
        <p>
          Si fuiste tú quien hizo esta solicitud, haz clic en el siguiente enlace para establecer una nueva contraseña. Este enlace estará disponible por 1 hora, después de eso tendrás que solicitar un nuevo restablecimiento de contraseña.
        </p>
        <a href='${resetLink}' class='reset-link'>Restablecer Contraseña</a>
        <p>
          Si no solicitaste este restablecimiento, puedes ignorar este correo. Tu cuenta sigue siendo segura.
        </p>
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
