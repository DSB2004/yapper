import { Injectable } from '@nestjs/common';
import { db } from 'src/lib/db';

@Injectable()
export class OtpService {
  async sendOTP({
    phone,
  }: {
    phone: string;
  }): Promise<{ message: string; success: boolean }> {
    try {
      console.log('[OTP] sendOTP called', { phone });

      const existingOtp = await db.otp.findFirst({
        where: { phone },
        orderBy: { createdAt: 'desc' },
      });
      if (existingOtp) {
        const diff = Date.now() - new Date(existingOtp.createdAt).getTime();
        const wait = 60 * 1000;
        if (diff < wait) {
          const remaining = Math.ceil((wait - diff) / 1000);
          return {
            message: `Please wait ${remaining}s before requesting a new OTP`,
            success: false,
          };
        }
        await db.otp.deleteMany({
          where: { phone },
        });
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await db.otp.create({
        data: { phone, otp },
      });

      console.log('[OTP]', otp);
      return { message: 'OTP sent successfully', success: true };
    } catch (err) {
      console.error('[OTP] sendOTP exception', err);
      return { message: 'Failed to send OTP', success: false };
    }
  }

  async verifyOTP(submittedOTP: string) {
    const record = await db.otp.findFirst({
      where: { otp: submittedOTP },
    });

    if (!record) {
      return {
        message: "OTP didn't match! Please try again",
        success: false,
      };
    }

    await db.otp.delete({
      where: { id: record.id },
    });

    return {
      message: 'OTP verified',
      success: true,
      phone: record.phone,
    };
  }
}
