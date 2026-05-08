

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



export const heroMapping = [
    {
        "title": "Aufs richtige \nPferd setzen.",
        "subtitle": "Ihr zuverlässiges Bindeglied zwischen anspruchsvollen Aufgabenstellungen und außergewöhnlichen Immobilienchancen.",
        "videoPath": "/video/hero.mp4"
    },
    {
        "title": "Vor-Sorge statt Nach-Sicht",
        "subtitle": "Ihr Portfolio braucht Betongold, wie Sie die Luft zum Atmen. \nSchützen Sie Ihr Kapital durch eines unserer hoch-performanten, für Sie maßgeschneiderten Assets.",
        "videoPath": "/video/hero1.mp4"
    }
]