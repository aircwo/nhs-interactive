import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { IconWorld } from '@tabler/icons-react';
import { LOCALES } from '../../utils/constants';
import Link from 'next/link';
import { classNames } from '../../utils';

export default function LanguageSelector({translate, locale}: Readonly<{translate: any, locale: string}>) {
  return (
    <Menu as='div' className='absolute right-5 top-5 max-xl:right-5 sm:right-8 text-left'>
      {/* Move to within the nhsuk container for large screens */}
      <div>
        <MenuButton id='language-button' className='inline-flex focus:outline-black focus:outline-8 focus:ring-4 focus:ring-yellow-400 w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50'>
          {translate('button.language')}
          <IconWorld
            className='-mr-1 h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </MenuButton>
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
        <MenuItems className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='langs'>
            {LOCALES.map(lang => {
              if (lang !== locale) {
                return (
                  <MenuItem key={lang} data-testid="language-item">
                    {({ focus }) => (
                      <Link
                        href={`/${lang}`}
                        locale={lang}
                        className={classNames(
                          focus ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
                  </MenuItem>
                );
              }
              return null;
            })}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
