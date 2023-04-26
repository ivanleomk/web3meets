import React from "react";
import SectionHeader from "src/components/SectionHeader";

const ChangeLog = () => {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-[37.5rem] pt-20 pb-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Changelog
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Here&apos;s everything that we shipped so far for Web3Meets
          </p>
        </div>
      </div>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <section
          id="2023-04-26"
          aria-labelledby="2023-04-26"
          className="md:flex"
        >
          <h2
            id="2023-04-24-heading"
            className="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right"
          >
            <a href="#2023-04-24">April 26, 2023</a>
          </h2>
          <div className="relative pl-7 pt-2 pb-16 md:w-3/4 md:pl-12 md:pt-0">
            <div className="absolute bottom-0 left-0 -top-3 w-px bg-slate-200 md:top-2.5"></div>
            <div className="absolute -left-1 -top-[1.0625rem] h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"></div>
            <div className="prose prose-sm prose-slate max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
              <h3>Website V0.5</h3>
              <p>
                The past few weeks have been a busy period but we&apos;re happy
                to announce our new features
              </p>
              Our new big features are
              <ul>
                <li>
                  A new submit form that allows you to submit events to be
                  blasted out to our telegram group{" "}
                </li>
                <li>New support for Organizations that partner with us</li>
                <li>
                  A new member to the team - Andrea! She&apos;ll be handling BD
                  related matters so please reach out to her for inquiries on
                  how we can help you with outreach and marketing
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChangeLog;
