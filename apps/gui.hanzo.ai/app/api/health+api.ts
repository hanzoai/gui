// health check endpoint for deployment verification
export default async function GET() {
  return Response.json({ status: 'ok' }, { status: 200 })
}
