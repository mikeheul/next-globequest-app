export const useRandomColor = () => {
    const getRandomColor = () => {
        // Define color range for shades of orange
        const orangeRange = [
            '#FFA94D', '#FF963B', '#FF7C27', '#FF6313', '#FF4C00',
            '#FFB366', '#FFAB59', '#FFA24D', '#FF9959', '#FF8C42',
            '#FF8F4C', '#FF8533', '#FF7F50', '#FF7526', '#FF6B1C'
        ];

        // Select a random color from the orange range
        return orangeRange[Math.floor(Math.random() * orangeRange.length)];
    };

    return getRandomColor;
};