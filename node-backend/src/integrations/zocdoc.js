/**
 * Partner-only integration boundary.
 * No public Zocdoc API endpoint or authentication scheme is assumed here.
 * Replace this adapter after you receive official partner documentation.
 */
export async function zocdocStatus() {
  return {
    connected:false,
    requiresPartnerApproval:true,
    docs:"https://www.zocdoc.com/business/developers/",
    message:"Apply as a Zocdoc Developer Partner and implement the approved API contract before displaying availability."
  };
}
export async function searchZocdocAvailability() {
  throw Object.assign(new Error("Zocdoc scheduling has not been connected to an approved partner API."),{status:501});
}
