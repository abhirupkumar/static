import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import SitePagePlaceholder from '../icons/site-page-placeholder';

interface WebpagePreviewImageProps {
    url: string;
    width?: number;
    height?: number;
}

const WebpagePreviewImage: React.FC<WebpagePreviewImageProps> = ({ url, width = 800, height = 600 }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const generatePreviewImage = async () => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url }),
                    mode: 'cors',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const html = await response.text();
                console.log('Fetched HTML:', html);

                const element = document.createElement('div');
                element.innerHTML = html;
                document.body.appendChild(element);

                const canvas = await html2canvas(element, {
                    width,
                    height,
                    useCORS: true,
                });

                console.log('Canvas:', canvas);
                setPreviewImage(canvas.toDataURL('image/png'));

                document.body.removeChild(element);
            } catch (error) {
                console.error('Error generating preview image:', error);
            }
        };

        generatePreviewImage();
    }, [url, width, height]);

    return previewImage ? (
        <img src={previewImage} alt="Webpage Preview" width={width} height={height} className="" />
    ) : (
        <SitePagePlaceholder />
    );
};

export default WebpagePreviewImage;