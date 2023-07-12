"use client";

import { Header as NHSHeader } from "nhsuk-react-components";
import LanguageSelector from "../LanguageSelector";
import { useTranslations } from "next-intl";

export const Header = ({locale}: {locale: string}) => {
  const translate = useTranslations('header');
  return (
    <>
      <NHSHeader transactional>
        <NHSHeader.Container>
          <NHSHeader.Logo href="/" />
          <NHSHeader.ServiceName href="/">{translate('title')}</NHSHeader.ServiceName>
          <LanguageSelector translate={translate} locale={locale} />
        </NHSHeader.Container>
      </NHSHeader>
    </>
  );
}
