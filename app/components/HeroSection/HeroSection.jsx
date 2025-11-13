import Image from "next/image";
import Link from "next/link";

export default function HeroSection({ hero }) {
    if (!hero) {
        return null;
    }

    const {
        title,
        subtitle,
        ctaText,
        ctaLink,
        backgroundImage,
        backgroundVideo,
        badge,
    } = hero;

    return (
        <section className="relative flex items-center justify-center overflow-hidden mt-20 py-44">
            <div className="absolute top-0 left-0 inset-0">
                {backgroundVideo ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : backgroundImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={backgroundImage}
                        alt="Hero background"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
                )}
            </div>
            {/* Overlay */}
            <div className="absolute left-0 top-0 inset-0 bg-black/50" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white space-y-6">
                {title && (
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <p className="text-lg md:text-xl lg:text-2xl  mx-auto text-white/90 ">
                        {subtitle}
                    </p>
                )}
                {ctaText && (
                    <Link
                        href={ctaLink || "/enroll"}
                        className="mt-8 inline-block bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 shadow-lg hover:shadow-xl"
                    >
                        {ctaText}
                    </Link>
                )}

                {badge && (
                    <div className="">
                        <span className="">{badge}</span>
                    </div>
                )}
            </div>
        </section>
    );
}
