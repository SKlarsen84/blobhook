import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.POCKETBASE_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL)

export async function authenticateAdmin() {
  if (!pb.authStore.isValid) {
    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL as string,
      process.env.POCKETBASE_ADMIN_PASSWORD as string
    )
  }
}

export default pb
