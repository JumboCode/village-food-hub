import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const storageSize = await getStorageSize();
        if (storageSize === null) {
            return NextResponse.json({ response: "Failed to retrieve storage size" }, { status: 500 });
        }

        return NextResponse.json({ storageSize }, { status: 200 });
    } catch (error) {
        console.error("Error in storage endpoint:", error);
        return NextResponse.json({ response: "Internal Server Error" }, { status: 500 });
    }
}

async function getStorageSize() {
    try {

        const response = await fetch("https://console.neon.tech/api/v2/projects/bold-dawn-35207560", {
            method: "GET",
            headers: {
                "accept": "application/json",
                "authorization": `Bearer ${process.env.NEON_TECH_API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error("Error fetching storage size:", error);
        return null;
    }
}