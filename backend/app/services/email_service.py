import asyncio
import html
import logging
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from typing import List, Optional, Tuple

from app.core.config import settings

logger = logging.getLogger("kady_sports.email")


class EmailService:
    """
    Dịch vụ gửi email qua giao thức SMTP TLS (Gmail smtp.gmail.com:587).
    Hỗ trợ fallback an toàn khi chưa cấu hình SMTP_APP_PASSWORD để demo offline.
    """

    @staticmethod
    def is_configured() -> bool:
        smtp_email = (settings.SMTP_EMAIL or "").strip()
        smtp_password = (settings.SMTP_APP_PASSWORD or "").strip()
        return bool(smtp_email and smtp_password)

    @staticmethod
    def _send_email_sync(
        recipient_email: str,
        subject: str,
        html_body: str,
        text_body: str,
    ) -> None:
        sender_email = (settings.SMTP_EMAIL or "").strip()
        # Gmail App Password thường được copy kèm khoảng trắng 4 ký tự; chuẩn hóa bỏ khoảng trắng
        app_password = (settings.SMTP_APP_PASSWORD or "").replace(" ", "").strip()
        smtp_host = (settings.SMTP_HOST or "smtp.gmail.com").strip()
        smtp_port = int(settings.SMTP_PORT or 587)

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = formataddr(("KADY Sports", sender_email))
        msg["To"] = recipient_email

        msg.attach(MIMEText(text_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, [recipient_email], msg.as_string())

    @staticmethod
    def _build_otp_email_content(
        recipient_email: str,
        otp_code: str,
        full_name: Optional[str] = None,
    ) -> Tuple[str, str, str]:
        display_name = html.escape((full_name or "").strip() or recipient_email.split("@")[0])
        safe_email = html.escape(recipient_email)
        safe_otp = html.escape(otp_code)

        subject = f"[KADY Sports] Mã xác thực đăng nhập của bạn: {otp_code}"

        text_body = (
            f"Xin chào {display_name},\n\n"
            f"Mã xác thực OTP 6 chữ số để đăng nhập vào KADY Sports là: {otp_code}\n"
            f"Mã này có hiệu lực trong vòng 5 phút.\n\n"
            f"Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này và không chia sẻ mã cho bất kỳ ai.\n\n"
            f"Trân trọng,\nĐội ngũ KADY Sports"
        )

        html_body = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mã xác thực KADY Sports</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:540px;background-color:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#2563eb 100%);padding:28px 32px;text-align:center;">
              <div style="display:inline-block;padding:6px 14px;border-radius:999px;background-color:rgba(255,255,255,0.14);color:#e0f2fe;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
                KADY Sports Store
              </div>
              <h1 style="margin:12px 0 4px;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">
                Xác thực tài khoản Email
              </h1>
              <p style="margin:0;font-size:13px;color:#cbd5e1;">
                Cửa hàng dụng cụ &amp; thời trang thể thao chính hãng
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">
                Xin chào <strong style="color:#0f172a;">{display_name}</strong>,
              </p>
              <p style="margin:0 0 22px;font-size:14px;line-height:1.65;color:#475569;">
                Chúng tôi nhận được yêu cầu đăng nhập / xác thực hộp thư <strong style="color:#1e293b;">{safe_email}</strong> tại <strong>KADY Sports</strong>. Vui lòng nhập mã OTP gồm 6 chữ số dưới đây để hoàn tất:
              </p>
              <div style="margin:24px 0;padding:20px 16px;background:linear-gradient(180deg,#eff6ff 0%,#f8fafc 100%);border:2px dashed #3b82f6;border-radius:14px;text-align:center;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.4px;color:#2563eb;margin-bottom:8px;">
                  Mã xác nhận OTP của bạn
                </div>
                <div style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:900;letter-spacing:10px;color:#0f172a;line-height:1.2;">
                  {safe_otp}
                </div>
                <div style="margin-top:10px;font-size:12px;color:#64748b;">
                  Hiệu lực trong <strong style="color:#dc2626;">5 phút</strong> (chỉ sử dụng 1 lần)
                </div>
              </div>
              <div style="padding:12px 16px;background-color:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px;font-size:12.5px;line-height:1.55;color:#92400e;">
                <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã OTP này với bất kỳ ai, kể cả nhân viên KADY Sports. Nếu bạn không yêu cầu mã này, hãy bỏ qua email.
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#64748b;">
              &copy; 2026 <strong>KADY Sports</strong> &bull; Đồng hành cùng đam mê thể thao của bạn
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

        return subject, html_body, text_body

    @staticmethod
    def _build_welcome_email_content(
        recipient_email: str,
        full_name: Optional[str] = None,
        interested_sports: Optional[List[str]] = None,
    ) -> Tuple[str, str, str]:
        display_name = html.escape((full_name or "").strip() or recipient_email.split("@")[0])
        sports_list = [s.strip() for s in (interested_sports or []) if s and s.strip()]
        sports_badges_html = "".join(
            f'<span style="display:inline-block;margin:3px 4px;padding:5px 12px;background-color:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:999px;font-size:12px;font-weight:600;">{html.escape(sport)}</span>'
            for sport in sports_list
        )
        sports_section = (
            f"""<div style="margin:18px 0;padding:16px;background-color:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                  <div style="font-size:12px;font-weight:700;color:#334155;margin-bottom:8px;">
                    Bộ môn thể thao bạn yêu thích:
                  </div>
                  <div>{sports_badges_html}</div>
                </div>"""
            if sports_badges_html
            else ""
        )
        sports_text = ", ".join(sports_list) if sports_list else "Đa bộ môn thể thao"

        subject = "Chào mừng bạn đến với KADY Sports!"
        text_body = (
            f"Xin chào {display_name},\n\n"
            f"Chúc mừng bạn đã xác thực thành công tài khoản tại KADY Sports!\n"
            f"Bộ môn thể thao bạn quan tâm: {sports_text}.\n\n"
            f"Khám phá ngay các sản phẩm dành riêng cho bạn tại: http://localhost:3000/goi-y\n\n"
            f"Trân trọng,\nĐội ngũ KADY Sports"
        )

        html_body = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chào mừng đến với KADY Sports</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1d4ed8 100%);padding:30px 32px;text-align:center;">
              <div style="display:inline-block;padding:6px 14px;border-radius:999px;background-color:rgba(255,255,255,0.14);color:#e0f2fe;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
                Welcome to KADY Sports
              </div>
              <h1 style="margin:12px 0 6px;font-size:24px;font-weight:800;color:#ffffff;">
                Chào mừng {display_name}!
              </h1>
              <p style="margin:0;font-size:13px;color:#dbeafe;">
                Tài khoản thành viên của bạn đã sẵn sàng
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 32px;">
              <p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#334155;">
                Cảm ơn bạn đã xác thực email và đồng hành cùng <strong>KADY Sports</strong>. Từ bây giờ, cửa hàng sẽ gợi ý những mẫu trang phục, giày và dụng cụ thi đấu phù hợp nhất với bộ môn và sở thích tập luyện của bạn.
              </p>
              {sports_section}
              <div style="margin:24px 0 8px;text-align:center;">
                <a href="http://localhost:3000/goi-y" style="display:inline-block;padding:12px 26px;background-color:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;border-radius:12px;">
                  Khám phá sản phẩm dành riêng cho bạn &rarr;
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#64748b;">
              &copy; 2026 <strong>KADY Sports</strong> &bull; Chúc bạn tập luyện bứt phá mỗi ngày!
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

        return subject, html_body, text_body

    async def send_otp_email(
        self,
        recipient_email: str,
        otp_code: str,
        full_name: Optional[str] = None,
    ) -> Tuple[bool, Optional[str]]:
        """
        Gửi mã OTP 6 chữ số tới hộp thư người dùng.
        Trả về (email_sent, error_message). Nếu chưa cấu hình SMTP_APP_PASSWORD thì log ra console và trả về (False, None).
        """
        if not self.is_configured():
            logger.info(
                "[EmailService][OFFLINE MODE] Chưa cấu hình SMTP_EMAIL/SMTP_APP_PASSWORD. "
                "Mã OTP demo cho %s là: %s (hết hạn sau 5 phút).",
                recipient_email,
                otp_code,
            )
            return False, None

        subject, html_body, text_body = self._build_otp_email_content(
            recipient_email=recipient_email,
            otp_code=otp_code,
            full_name=full_name,
        )
        try:
            await asyncio.to_thread(
                self._send_email_sync,
                recipient_email,
                subject,
                html_body,
                text_body,
            )
            logger.info("[EmailService] Đã gửi mã OTP tới %s qua Gmail SMTP.", recipient_email)
            return True, None
        except Exception as exc:
            logger.error("[EmailService] Lỗi gửi email OTP tới %s: %s", recipient_email, exc, exc_info=True)
            return False, str(exc)

    async def send_welcome_email(
        self,
        recipient_email: str,
        full_name: Optional[str] = None,
        interested_sports: Optional[List[str]] = None,
    ) -> None:
        """
        Gửi email chào mừng chạy ngầm qua FastAPI BackgroundTasks sau khi xác thực OTP thành công.
        """
        if not self.is_configured():
            logger.info(
                "[EmailService][OFFLINE MODE] Bỏ qua gửi Welcome Email tới %s (chưa cấu hình SMTP).",
                recipient_email,
            )
            return

        subject, html_body, text_body = self._build_welcome_email_content(
            recipient_email=recipient_email,
            full_name=full_name,
            interested_sports=interested_sports,
        )
        try:
            await asyncio.to_thread(
                self._send_email_sync,
                recipient_email,
                subject,
                html_body,
                text_body,
            )
            logger.info("[EmailService] Đã gửi Welcome Email tới %s.", recipient_email)
        except Exception as exc:
            logger.error("[EmailService] Lỗi gửi Welcome Email tới %s: %s", recipient_email, exc, exc_info=True)


email_service = EmailService()

