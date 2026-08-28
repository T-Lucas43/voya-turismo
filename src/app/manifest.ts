import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Voya Turismo", short_name: "Voya", description: "Pacotes de viagem, planejamento e aluguel de roupas de frio.", start_url: "/", display: "standalone", background_color: "#fbfaf6", theme_color: "#061f37", icons: [{ src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" }] };
}
