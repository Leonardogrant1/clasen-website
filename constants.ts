

export type TestimonialObject = {
    image_path: string;
};

export type Testimonial = {
    client_image_path: string | null;
    client_name: string;
    client_quote: string;
    client_type: string;
    object_name: string;
    object_location: string;
    objects: TestimonialObject[];
};

export const testimonials: Testimonial[] = [
    {
        client_image_path: "/testimonials/phillip_geissler/profile.jpeg",
        client_name: "Philippe Geissler",
        client_quote: "Das Team konnte mich durch strukturierte Vorgehensweise und außergewöhnliche Marktkenntnis überzeugen. Eine Zusammenarbeit, die ich jederzeit weiterempfehlen würde.",
        client_type: "Jurist/master LMU",
        object_name: "Villa Maxvorstadt",
        object_location: "München · Maxvorstadt",
        objects: [
            {
                image_path: "/testimonials/phillip_geissler/image_1.jpg",
            },
            {
                image_path: "/testimonials/phillip_geissler/image_2.jpg",
            },
            {
                image_path: "/testimonials/phillip_geissler/image_3.jpg",
            },
        ],
    },
    {
        client_image_path: "/testimonials/phillip_geissler/profile.jpeg",
        client_name: "Maria Hoffmann",
        client_quote: "Clasen hat uns nicht nur die perfekte Immobilie gefunden, sondern uns durch den gesamten Prozess begleitet — diskret, kompetent und mit echtem Herzblut.",
        client_type: "Zufriedene Käuferin",
        object_name: "Villa Maxvorstadt",
        object_location: "München · Maxvorstadt",
        objects: [
            {
                image_path: "/backgrounds/chess.png",
            },
            {
                image_path: "/backgrounds/facade.png",
            },
            {
                image_path: "/backgrounds/chess.png",
            },
        ],
    },
    {
        client_image_path: "/testimonials/phillip_geissler/profile.jpeg",
        client_name: "Dr. Thomas Bergmann",
        client_quote: "Als Unternehmer war mir Diskretion und Effizienz besonders wichtig. Clasen hat beides in höchstem Maß geliefert — und dabei eine Rendite erzielt, die meine Erwartungen weit übertroffen hat.",
        client_type: "Investor",
        object_name: "Villa Maxvorstadt",
        object_location: "München · Maxvorstadt",
        objects: [
            {
                image_path: "/backgrounds/facade.png",
            },
            {
                image_path: "/backgrounds/chess.png",
            },
            {
                image_path: "/backgrounds/facade.png",
            },
        ],
    },
];

export const heroMapping = [
    {
        "title": "Aufs richtige \nPferd setzen.",
        "subtitle": "Ihr zuverlässiges Bindeglied zwischen anspruchsvollen Mandanten und außergewöhnlichen Immobilienchancen.",
        "videoPath": "/video/hero.mp4"
    },
    {
        "title": "Vor-Sorge statt Nach-Sicht",
        "subtitle": "Ihr Portfolio braucht Betongold, wie Sie die Luft zum Atmen. \nSchützen Sie Ihr Kapital durch eines unserer hoch-performanten, für Sie maßgeschneiderten Assets.",
        "videoPath": "/video/hero1.mp4"
    }
]