"use client";

import { useState, useEffect } from "react";
import { urlFor } from "@/sanity/imageUrl";


type Post = {
  _id: string;
  mainImage: any;
  description: string;
  authorName: string;
  authorLogo: any;
};

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3; // Show 6 posts per page

  const fetchPosts = async (authorName = "", sort = "", pageNum = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (authorName) params.append("authorName", authorName);
    if (sort) params.append("sort", sort);
    params.append("page", pageNum.toString());
    params.append("limit", limit.toString());

    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    setPosts(data.posts);
    setTotalPages(Math.ceil(data.total / limit));
    setLoading(false);
  };

  const handleApply = () => {
    setPage(1);
    fetchPosts(searchTerm, sortOrder, 1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortOrder("");
    setPage(1);
    fetchPosts("", "", 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchPosts(searchTerm, sortOrder, newPage);
  };

  useEffect(() => {
    fetchPosts("", "", 1); // initial fetch
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
        Search & Sort Posts
      </h1>

      {/* Search + Sort Controls */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Enter author name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-xl border shadow-sm w-64"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 rounded-xl border shadow-sm w-40"
        >
          <option className="text-slate-700" value="">Sort by author</option>
          <option className="text-slate-700" value="asc">Author A → Z</option>
          <option className="text-slate-700" value="desc">Author Z → A</option>
        </select>

        <button
          onClick={handleApply}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          Apply
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition"
        >
          Reset
        </button>
      </div>

      {/* Posts Display */}
      {loading ? (
        <p className="text-center text-gray-300">Loading...</p>
      ) : posts.length < 1 ? (
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
          No Data Found
        </h1>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-10">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 duration-300"
              >
                <img
                  src={
                    post.mainImage
                      ? urlFor(post.mainImage).width(600).height(300).url()
                      : ""
                  }
                  alt="Main"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-gray-700 text-sm mb-4">{post.description}</p>
                  <div className="flex items-center space-x-3 mt-auto">
                    <img
                      src={
                        post.authorLogo
                          ? urlFor(post.authorLogo).width(40).height(40).url()
                          : ""
                      }
                      alt="Author Logo"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-gray-900 font-medium">
                      {post.authorName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}





// // app/page.tsx
// import { urlFor } from "@/sanity/imageUrl";
// import { client } from "@/sanity/client";

// type Post = {
//   _id: string
//   mainImage: any
//   description: string
//   authorName: string
//   authorLogo: any
// }

// export default async function HomePage() {

//   //It will fetch the data in ascending order based on the authorName
//   // const query = `*[_type == "post"] | order(authorName asc) {
//   //   _id,
//   //   mainImage,
//   //   description,
//   //   authorName,
//   //   authorLogo
//   // }`;

//   //It will fetch the data in descending order based on the authorName
//   // const query = `*[_type == "post"] | order(authorName desc) {
//   //   _id,
//   //   mainImage,
//   //   description,
//   //   authorName,
//   //   authorLogo
//   // }`;


//   //It will fetch the data which matches authorName as  "Rendom Person"

//   const query = `*[_type == "post" && authorName match "Rendom person"] {
//     _id,
//     mainImage,
//     description,
//     authorName,
//     authorName,
//     authorLogo
//   }`;
  
//   const posts: Post[] = await client.fetch(query);

//   return (
//     <main className="min-h-screen bg-gray-100 py-10 px-4">
//       <h1 className="text-3xl font-bold mb-8 text-center text-gray-600">Our Posts</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
//         {posts.map((post) => (
//           <div
//             key={post._id}
//             className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 duration-300"
//           >
//             <img
//               src={
//                 post.mainImage ? urlFor(post.mainImage ).width(600).height(300).url() : ""}
//               alt="Main"
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <p className="text-gray-700 text-sm mb-4">{post.description}</p>
//               <div className="flex items-center space-x-3 mt-auto">
//                 <img
//                   src={
//                     post.authorLogo  ? urlFor(post.authorLogo).width(40).height(40).url() : ""}
//                   alt="Author Logo"
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <span className="text-gray-900 font-medium">
//                   {post.authorName}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </main>
//   )
// }



// app/page.tsx or app/page.jsx

// import { client } from "@/sanity/client";

// const PARAGRAPHS_QUERY = `*[_type == "para"]{
//   _id,
//   paragraph
// }`;

// export default async function HomePage() {
//   const data = await client.fetch(PARAGRAPHS_QUERY);

//   return (
//     <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col items-center justify-center">
//       <h1 className="text-3xl font-bold mb-6">Paragraphs</h1>

//       {data.map((item: { _id: string; paragraph: string[] }) => (
//         <div
//           key={item._id}
//           className="border border-gray-40 mb-4 text-center rounded-lg p-6 w-full max-w-2xl shadow-md bg-white flex flex-col gap-2"
//         >
//           {item.paragraph.map((para, idx) => (
//             <p key={idx} className="text-lg leading-relaxed text-gray-700">
//               {para}
//             </p>
//           ))}
//         </div>
//       ))}
//     </main>
//   );
// }





















// import Link from "next/link";
// import { type SanityDocument } from "next-sanity";

// import { client } from "@/sanity/client";

// const POSTS_QUERY = `*[
//   _type == "post"
//   && defined(slug.current)
// ]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

// const options = { next: { revalidate: 30 } };

// export default async function IndexPage() {
//   const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

//   return (
//     <main className="container mx-auto min-h-screen max-w-3xl p-8">
//       <h1 className="text-4xl font-bold mb-8">Posts</h1>
//       <ul className="flex flex-col gap-y-4">
//         {posts.map((post) => (
//           <li className="hover:underline" key={post._id}>
//             <Link href={`/${post.slug.current}`}>
//               <h2 className="text-xl font-semibold">{post.title}</h2>
//               <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }