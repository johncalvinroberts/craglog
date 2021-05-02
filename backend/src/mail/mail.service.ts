import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService as SendGrid } from '@sendgrid/mail';

@Injectable()
export class MailService {
  private sgMail: SendGrid;

  constructor(private readonly configService: ConfigService) {
    this.sgMail = new SendGrid();
    this.sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
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
    await this.sgMail.send({
      from: 'emails@craglog.cc',
      to,
      subject,
      html: this.makeANiceEmail(text),
      text,
    });
    // return a message
    return { message: 'Success' };
  }
}
