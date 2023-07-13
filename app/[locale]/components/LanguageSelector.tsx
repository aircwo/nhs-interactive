import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { IconWorld } from '@tabler/icons-react';
import Link from "next-intl/link";
import { LOCALES } from '../../utils/constants';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function LanguageSelector({translate, locale}: {translate: any, locale: string}) {
  return (
    <Menu as='div' className='relative max-lg:absolute max-lg:right-4 float-right inline-block text-left'>
      <div>
        {/* Hover style made need changed to match NHS */}
        <Menu.Button id='language-button' className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
          {translate('button.language')}
          <IconWorld
            className='-mr-1 h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='langs'>
            {LOCALES.map(lang => {
              if (lang !== locale) {
                return (
                  <Menu.Item key={lang} data-testid="language-item">
                    {({ active }) => (
                      <Link
                        href='/'
                        locale={lang}
                        className={classNames(
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                          "block px-4 py-2 text-sm rounded-md"
                        )}
                      >
                        <p className='mb-0 py-2'>
                          <span
                            className={`mr-4 h-5 w-5 rounded-md fi fis fi-${lang === 'en' ? 'gb-eng' : lang === 'cy' ? 'gb-wls' : 'gb-sct'}`}
                            aria-hidden='true'
                          />
                          {lang === 'en' ? 'English' : lang === 'cy' ? 'Cymraeg' : 'Gaelic'}
                        </p>
                      </Link>
                    )}
                  </Menu.Item>
                );
              }
              return null;
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
