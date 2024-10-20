import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST_NODEMAILER,
        port: process.env.PORT_NODEMAILER_SECURE,
        secure: true,
        auth: {
          user: process.env.USER_NODEMAILER,
          pass: process.env.PASSWORD_NODEMAILER,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
