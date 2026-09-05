import { requireUser } from "@/lib/auth/require-user";
import Workspace from "@/app/components/workspace/Workspace";
export default async function Page() {
  const user = await requireUser();
  return <Workspace email={user.email || ""} />;
}
