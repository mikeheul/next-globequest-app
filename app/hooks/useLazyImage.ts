import { useInView } from 'react-intersection-observer';

interface LazyImageProps {
    src: string;
    alt: string;
    placeholder: string;
}

export const useLazyImage = ({ src, alt, placeholder }: LazyImageProps) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '100px',
    });

    return { ref, inView, src, alt, placeholder };
};