import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailRegister(to: string, subject: string, html: string) {
    try {
      console.log('Template to:', to);
      console.log('Template subject:', subject);

      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      console.log('Email enviado correctamente al usuario registrado.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendEmailSubscriber(to: string, subject: string, html: string) {
    try {
      console.log('Template to:', to);
      console.log('Template subject:', subject);

      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      console.log('Email enviado al usuario subscrito.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendEmailUpdateUser(to: string, subject: string, html: string) {
    try {
      console.log('Template to:', to);
      console.log('Template subject:', subject);

      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      console.log(
        'Email enviado al usuario al cual se le actualizaron sus datos y/o contraseña.',
      );
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendEmailToUsers(to: string, subject: string, html: string) {
    try {
      console.log('Template to:', to);
      console.log('Template subject:', subject);

      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      console.log('Email enviado al usuario.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
