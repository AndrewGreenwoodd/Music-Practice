import { LoginForm } from "@/components/auth/login-form";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function LoginPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return <LoginForm dict={dict.login} />;
}
