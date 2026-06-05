import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-app py-24 text-center">
      <p className="text-7xl font-black text-gradient-brand">404</p>
      <h1 className="mt-3 text-2xl font-black">الصفحة غير موجودة</h1>
      <p className="mt-2 text-muted-foreground">يبدو أن الرابط الذي تبحث عنه غير متاح.</p>
      <Link to="/"><Button size="lg" className="mt-6">العودة للرئيسية</Button></Link>
    </div>
  );
}
