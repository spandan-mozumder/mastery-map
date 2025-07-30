import SyncUser from "@/actions/sync-user";

export default async function Page() {
  return await SyncUser();
}
