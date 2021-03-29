import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private transport: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transport = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  private makeANiceEmail(text: string) {
    return `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello There!</h2>
    <p>${text}</p>
    <p>🏔, Craglog</p>
  </div>
`;
  }

  async sendANiceEmail({
    text,
    to,
    subject,
  }: {
    text: string;
    to: string;
    subject: string;
  }) {
    await this.transport.sendMail({
      from: 'no-reply@craglog.com',
      to,
      subject,
      html: this.makeANiceEmail(text),
    });
    // 4. Return the message
    return { message: 'Thanks!' };
  }
}
