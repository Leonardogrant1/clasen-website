"use server";

export async function getCalendlyMembers() {
  if (!process.env.CALENDLY_ORG_URI || !process.env.CALENDLY_ACCESS_TOKEN) {
    console.error("Missing Calendly environment variables");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.calendly.com/organization_memberships?organization=${process.env.CALENDLY_ORG_URI}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch calendly members", await response.text());
      return [];
    }

    const data = await response.json();
    let members = data.collection || [];

    // Custom sort order
    const orderMap: Record<string, number> = {
      "Leonardo Granetto": 1,
      "Manuel Leitl": 2,
      "Alexander Clasen": 3
    };

    members.sort((a: any, b: any) => {
      const nameA = a.user?.name || "";
      const nameB = b.user?.name || "";
      const orderA = orderMap[nameA] || 99;
      const orderB = orderMap[nameB] || 99;
      return orderA - orderB;
    });

    return members;
  } catch (error) {
    console.error("Error fetching calendly members:", error);
    return [];
  }
}
