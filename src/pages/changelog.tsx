import React from "react";
import SectionHeader from "src/components/SectionHeader";

const ChangeLog = () => {
  return (
    <>
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="relative mx-auto max-w-[37.5rem] pt-20 pb-20 text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Changelog
          </h1>
          <p class="mt-4 text-base leading-7 text-slate-600">
            Stay up to date with all of the latest additions and improvements
            we've made to Tailwind UI.
          </p>
          <form
            action="https://app.convertkit.com/forms/1074308/subscriptions"
            method="post"
            class="mt-6 flex justify-center"
          >
            <h2 class="sr-only">Subscribe via email</h2>
            <div class="relative w-64 shrink">
              <label for="subscribe-email" class="sr-only">
                Email address
              </label>
              <input
                id="subscribe-email"
                name="email_address"
                type="email"
                required=""
                class="block h-10 w-full rounded-md bg-white pl-12 pr-3 text-slate-900 shadow-md shadow-black/5 ring-1 ring-slate-900/5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:text-sm sm:leading-6"
                placeholder="Subscribe via email"
              />
              <svg
                class="pointer-events-none absolute left-3 top-2 h-6 w-6 stroke-slate-400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 7.92C5 6.86 5.865 6 6.931 6h10.138C18.135 6 19 6.86 19 7.92v8.16c0 1.06-.865 1.92-1.931 1.92H6.931A1.926 1.926 0 0 1 5 16.08V7.92Z"></path>
                <path d="m6 7 6 5 6-5"></path>
              </svg>
            </div>
            <button
              type="submit"
              class="ml-4 inline-flex flex-none justify-center rounded-lg bg-slate-900 py-2.5 px-4 text-sm font-semibold text-white hover:bg-slate-700"
            >
              <span>Subscribe</span>
            </button>
          </form>
        </div>
      </div>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <section
          id="2023-04-24"
          aria-labelledby="2023-04-24-heading"
          class="md:flex"
        >
          <h2
            id="2023-04-24-heading"
            class="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right"
          >
            <a href="#2023-04-24">April 24, 2023</a>
          </h2>
          <div class="relative pl-7 pt-2 pb-16 md:w-3/4 md:pl-12 md:pt-0">
            <div class="absolute bottom-0 left-0 -top-3 w-px bg-slate-200 md:top-2.5"></div>
            <div class="absolute -left-1 -top-[1.0625rem] h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"></div>
            <div class="prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600 max-w-none">
              <h3>All-new application UI pages + huge component update</h3>
              <p>
                We just shipped a big application UI refresh that includes
                totally redesigned page examples, and dozens of updated and
                brand new components.
              </p>
              <a
                href="/components/application-ui/page-examples/home-screens"
                inertia=""
              >
                <img
                  class="rounded-xl ring-1 ring-slate-700/10 ring-offset-[-1px]"
                  src="/img/changelog/20230424-application-ui-update.png"
                  alt="Collage of new application UI component designs"
                />
              </a>
              <p>
                The new page examples include both light and dark designs, and
                also include the highly coveted home screen design everyone has
                been asking us for after seeing it used as screenshots in some
                of our new marketing components.
              </p>
              <ul>
                <li>
                  Added 2 new designs to the{" "}
                  <a
                    href="/components/application-ui/page-examples/home-screens"
                    inertia=""
                  >
                    Home Screens
                  </a>{" "}
                  category
                </li>
                <li>
                  Added 2 new designs to the{" "}
                  <a
                    href="/components/application-ui/page-examples/detail-screens"
                    inertia=""
                  >
                    Detail Screens
                  </a>{" "}
                  category
                </li>
                <li>
                  Added 2 new designs to a new{" "}
                  <a
                    href="/components/application-ui/page-examples/settings-screens"
                    inertia=""
                  >
                    Settings Screens
                  </a>{" "}
                  category
                </li>
              </ul>
              <p>
                We also went through all of the existing component categories to
                find opportunities for improvements, including new badges,
                stacked lists, tables, form layouts, stats sections, and more.
              </p>
              <ul>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/elements/badges"
                    inertia=""
                  >
                    Badges
                  </a>{" "}
                  category with 18 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/elements/buttons"
                    inertia=""
                  >
                    Buttons
                  </a>{" "}
                  category with 3 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/data-display/description-lists"
                    inertia=""
                  >
                    Description Lists
                  </a>{" "}
                  category with 7 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a href="/components/application-ui/lists/feeds" inertia="">
                    Feeds
                  </a>{" "}
                  category with 1 new design
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/forms/form-layouts"
                    inertia=""
                  >
                    Form Layouts
                  </a>{" "}
                  category with 5 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/lists/grid-lists"
                    inertia=""
                  >
                    Grid Lists
                  </a>{" "}
                  category with 1 new design
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/application-shells/multi-column"
                    inertia=""
                  >
                    Multi-Column Layouts
                  </a>{" "}
                  category with 6 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/headings/page-headings"
                    inertia=""
                  >
                    Page Headings
                  </a>{" "}
                  category with 2 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/application-shells/sidebar"
                    inertia=""
                  >
                    Sidebar Layouts
                  </a>{" "}
                  category with 8 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/navigation/sidebar-navigation"
                    inertia=""
                  >
                    Sidebar Navigation
                  </a>{" "}
                  category with 5 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/forms/sign-in-forms"
                    inertia=""
                  >
                    Sign-in and Registration
                  </a>{" "}
                  category with 5 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/lists/stacked-lists"
                    inertia=""
                  >
                    Stacked Lists
                  </a>{" "}
                  category with 17 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/data-display/stats"
                    inertia=""
                  >
                    Stats
                  </a>{" "}
                  category with 2 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a href="/components/application-ui/lists/tables" inertia="">
                    Tables
                  </a>{" "}
                  category with 3 new designs
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/navigation/tabs"
                    inertia=""
                  >
                    Tabs
                  </a>{" "}
                  category with 1 new design
                </li>
                <li>
                  Updated the{" "}
                  <a
                    href="/components/application-ui/navigation/vertical-navigation"
                    inertia=""
                  >
                    Vertical Navigation
                  </a>{" "}
                  category with 5 new designs
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
