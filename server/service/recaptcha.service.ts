export class RecaptchaService {
  constructor() {}

  async validateToken(response: string, remoteip?: string) {
    const config = useRuntimeConfig();
    const url = `https://www.recaptcha.net/recaptcha/api/siteverify`;

    const secret = config.baseGoogleRecaptchaPrivate;

    const repo = await $fetch<{ success: boolean, challenge_ts: string, hostname: string, score: number, action: string }>(url, {
      method: 'GET',
      params: { secret, response, remoteip },
    });
    return repo;
  }
}
