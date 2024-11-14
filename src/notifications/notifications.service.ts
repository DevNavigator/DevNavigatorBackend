import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { UserRepository } from '../user/user.repository';
import { dailysNotifications } from 'src/email/templates/dailyNotification.template';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
  ) {}

  //? Cron job que se ejecuta cada lunes a las 9:15 AM en la zona horaria de cada usuario
  @Cron('15 9 * * 1', {
    name: 'notifications',
    timeZone: 'UTC',
  })
  // Cron job que se ejecuta cada de
  //@Cron('*/30 * * * *', {
  //name: 'notifications',
  // timeZone: 'UTC',
  //})
  async triggerNotifications() {
    const users = await this.userRepository.findAll();

    for (const user of users) {
      const userCreationDate = new Date(user.created_at);
      const currentDate = new Date();

      const daysSinceCreation = Math.floor(
        (currentDate.getTime() - userCreationDate.getTime()) /
          (1000 * 3600 * 24),
      );

      if (daysSinceCreation >= 3) {
        const html = dailysNotifications(user.name);
        await this.sendEmailToUsers(
          user.email,
          `Te extraño 🥲 ${user.name}, volvamos a estudiar con 💙🤓 DevNavigator`,
          html,
        );

        console.log(
          `Correo enviado a ${user.email} para que vuelva a estudiar con DevNavigator.`,
        );
      }
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
      console.log('Email enviado al usuario:', to);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
