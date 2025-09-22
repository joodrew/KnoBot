import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const empresas = [
    {
        nome: "Apple",
        slogan: "Think Different.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
        nome: "Microsoft",
        slogan: "Be what's next.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
        nome: "Google",
        slogan: "Do the right thing.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
        nome: "Amazon",
        slogan: "Work hard. Have fun. Make history.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
        nome: "Samsung",
        slogan: "Do what you can't.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    },
];

export default function EmpresaCarousel() {
    return (
        <div className="py-8 px-4 rounded ">
            <h2 className="text-2xl font-bold text-center text-orange-400 mb-6">
                Empresas de Tecnologia
            </h2>

            <Carousel opts={{
                align: "start",
                loop: true,
            }} className="w-full relative" >
                <CarouselContent className="-ml-4">
                    {empresas.map((empresa, index) => (
                        <CarouselItem
                            key={index}
                            className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                            <div className=" bg-white rounded shadow h-40 flex flex-col overflow-hidden">
                                {/* Parte superior com logo como fundo */}
                                <div
                                    className="m-3 flex-[1.2] bg-center bg-no-repeat bg-contain"
                                    style={{ backgroundImage: `url(${empresa.logo})` }}
                                />

                                {/* Linha divisória */}
                                <div className="border-t-[1.5px] border-orange-400" />

                                {/* Parte inferior com nome, slogan e logo pequena */}
                                <div
                                    className="flex-[0.8] bg-gray-500  bg-opacity-80 p-2 text-center"
                                >
                                    <h3 className="text-lg text-orange-400 font-semibold">
                                        {empresa.nome}
                                    </h3>
                                    <p className="text-sm text-white">{empresa.slogan}</p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-orange-400 text-white rounded-full p-2 shadow hover:bg-orange-500 transition" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-orange-400 text-white rounded-full p-2 shadow hover:bg-orange-500 transition" />
            </Carousel>
        </div>
    );
}
