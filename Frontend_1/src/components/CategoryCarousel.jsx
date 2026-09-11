import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/Redux/jobSlice';

const CategoryCarousel = () => {
    const category = [
        "Frontend Developer",
        "Backend Developer",
        "Data Science",
        "Graphic Designer",
        "FullStack Developer",
        "DevOps Engineer"
    ];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className='px-12 sm:px-16 max-w-xl mx-auto my-12 sm:my-16'>
            <Carousel className="w-full">
                <CarouselContent className='-ml-2 md:-ml-4'>
                    {category.map((cat, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center">
                            <Button
                                onClick={() => searchHandler(cat)}
                                variant="outline"
                                className="w-full truncate hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 font-semibold rounded-full text-xs sm:text-sm py-2"
                            >
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='hidden sm:flex -left-10' />
                <CarouselNext className='hidden sm:flex -right-10' />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
