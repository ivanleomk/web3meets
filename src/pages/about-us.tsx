import Image from "next/image";
import React from "react";

const people = [
  {
    name: "Ivan",
    role: "Tech Lead",
    imageUrl: "/ivan.jpeg",
    bio: "Exploring a new interest in web3 and looking for funky projects such as these to work on in my spare time.",
    twitterUrl: "https://twitter.com/ivanleomk",
    linkedinUrl: "https://www.linkedin.com/in/ivanleo/",
  },
  {
    name: "Jones",
    role: "Product Lead",
    imageUrl: "/jones.jpeg",
    bio: "Product Manager @ collection.xyz. PM by day, nft degen by night",
    twitterUrl: "https://twitter.com/0xtraderjones",
    linkedinUrl: "https://www.linkedin.com/in/jones-lim-965586178/",
  },
];

const AboutUs = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet our leadership
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We’re a dynamic group of individuals who are passionate about what
            we do and dedicated to delivering the best results for our clients.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:max-w-4xl lg:gap-x-8 xl:max-w-none"
        >
          {people.map((person) => (
            <li key={person.name} className="flex flex-col gap-6 xl:flex-row">
              <Image
                className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
                src={person.imageUrl}
                height={200}
                width={200}
                alt={`Profile Picture for ${person.name}`}
              />
              <div className="flex-auto">
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-gray-600">
                  {person.role}
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  {person.bio}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
