import { NextResponse } from "next/server";
import { client } from "@/sanity/client";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const authorName = searchParams.get("authorName");
    const sortOrder = searchParams.get("sort");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const start = (page - 1) * limit;
    const end = start + limit;

    let filter = `*[_type == "post"`;
    if (authorName) {
        filter += ` && authorName match $name`;
    }
    filter += "]";

    // Total count query for pagination
    const totalQuery = `${filter}`;
    const totalCount = await client.fetch(`count(${totalQuery})`, {
        name: `${authorName ?? ""}*`,
    });

    let query = `${filter}`;
    if (sortOrder === "asc" || sortOrder === "desc") {
        query += ` | order(authorName ${sortOrder})`;
    }
    query += `[${start}...${end}]`;

    query += `{
        _id,
        mainImage,
        description,
        authorName,
        authorLogo
    }`;

    const posts = await client.fetch(query, {
        name: `${authorName ?? ""}*`,
    });

    return NextResponse.json({
        page,
        limit,
        total: totalCount,
        posts,
    });
}

// export async function GET(req: Request) {

//     const { searchParams } = new URL(req.url);
//     const authorName = searchParams.get("authorName");
//     const sortOrder = searchParams.get("sort");
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");

//     const start = (page - 1) * limit;
//     const end = start + limit;


//     // Start building GROQ query
//     let query = `*[_type == "post"`;

//     if (authorName) {
//         query += ` && authorName match $name`;
//     }

//     query += "]";

//     // so it becomes =>   `*[_type == "post" && authorName match $name]


//     if (sortOrder === "asc" || sortOrder === "desc") {
//         query += ` | order(authorName ${sortOrder})`;
//         // so it becomes ==> `*[_type == "post"] | order(authorName &{sortOrder})`
//     }

//     query += `[${start}...${end}]`;

//     query += `{
//     _id,
//     mainImage,
//     description,
//     authorName,
//     authorLogo
//   }`;

//     const posts = await client.fetch(query, {
//         name: `${authorName ?? ""}*`,
//     });

//     return NextResponse.json({
//         page,
//         limit,
//         count: posts.length,
//         posts,
//     });
// }


//     let query = `*[_type == "post"`;

//     if (authorName) {
//         query += ` && authorName match $name`;
//     }

//     query += "]";

//     // so it becomes =>   `*[_type == "post" && authorName match $name]

//     if (sortOrder === "asc" || sortOrder === "desc") {
//         query += ` | order(authorName ${sortOrder})`;

//         // so it becomes ==> `*[_type == "post"] | order(authorName &{sortOrder})`
//     }

//     query += ` {
//     _id,
//     mainImage,
//     description,
//     authorName,
//     authorLogo
//   }`;

//     //So if Both sort and search is not applied then it becomes =>
//     // `*[_type == "post"]{
//     //     _id,
//     //     mainImage,
//     //     description,
//     //     authorName,
//     //     authorLogo
//     // }`


//     //So if search is applied then it becomes => 
//     // `*[_type == "post" && authorName match $name]{
//     //     _id,
//     //     mainImage,
//     //     description,
//     //     authorName,
//     //     authorLogo
//     // }`

//     //So if sort is applied then it becomes => 
//     // `*[_type == "post"] | order(authorName &{sortOrder}) {
//     //     _id,
//     //     mainImage,
//     //     description,
//     //     authorName,
//     //     authorLogo
//     // }`

//     //So if both sort and search applied then it becomes =>
//     // `*[_type == "post" && authorName match &name] | order(authorName &{sortOrder}) {
//     //     _id,
//     //     mainImage,
//     //     description,
//     //     authorName,
//     //     authorLogo
//     // }`

//     const posts = await client.fetch(query, {
//         name: `${authorName ?? ""}*`,
//     });

//     return NextResponse.json(posts);
// }



// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);

//     const authorName = searchParams.get("authorName");
//     const sortOrder = searchParams.get("sort");
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");

//     const start = (page - 1) * limit;
//     const end = start + limit;

//     // Start building GROQ query
//     let query = `*[_type == "post"`;

//     if (authorName) {
//         query += ` && authorName match $name`;
//     }

//     query += "]";

//     if (sortOrder === "asc" || sortOrder === "desc") {
//         query += ` | order(authorName ${sortOrder})`;
//     }

//     query += `[${start}...${end}]`;

//     query += `{
//     _id,
//     mainImage,
//     description,
//     authorName,
//     authorLogo
//   }`;

//     const posts = await client.fetch(query, {
//         name: `${authorName ?? ""}*`,
//     });

//     return NextResponse.json({
//         page,
//         limit,
//         count: posts.length,
//         posts,
//     });
// }
