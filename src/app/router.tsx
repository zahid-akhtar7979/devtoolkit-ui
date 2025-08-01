import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SimpleLayout } from '../shared/layout/SimpleLayout';

// Import feature pages
import { Base64Page } from '../features/base64/pages/Base64Page';
import { HashPage } from '../features/hash/pages/HashPage';
import { JwtPage } from '../features/jwt/pages/JwtPage';
import { JasyptPage } from '../features/jasypt/pages/JasyptPage';
import { CronPage } from '../features/cron/pages/CronPage';
import { DiffPage } from '../features/diff/pages/DiffPage';
import { ImageToPdfPage } from '../features/imagetopdf/pages/ImageToPdfPage';
import { ImageCompressorPage } from '../features/compressor/pages/ImageCompressorPage';
import { ImagePage } from '../features/image/pages/ImagePage';

// Converter tools
import { ConverterPage } from '../features/converter/pages/ConverterPage';
import { PdfMergerPage } from '../features/pdfmerger/pages/PdfMergerPage';
import { RegexPage } from '../features/regex/pages/RegexPage';
import { SqlPage } from '../features/sql/pages/SqlPage';
import { TimestampPage } from '../features/timestamp/pages/TimestampPage';
import { UrlPage } from '../features/url/pages/UrlPage';
import { UuidPage } from '../features/uuid/pages/UuidPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SimpleLayout />}>
        <Route index element={<Base64Page />} />
        <Route path="base64" element={<Base64Page />} />
        <Route path="hash" element={<HashPage />} />
        <Route path="jwt" element={<JwtPage />} />
        <Route path="jasypt" element={<JasyptPage />} />
        <Route path="cron" element={<CronPage />} />
        <Route path="diff" element={<DiffPage />} />
        <Route path="imagetopdf" element={<ImageToPdfPage />} />
        <Route path="compressor" element={<ImageCompressorPage />} />
        <Route path="image" element={<ImagePage />} />
        <Route path="converter" element={<ConverterPage />} />
        <Route path="pdfmerger" element={<PdfMergerPage />} />
        <Route path="regex" element={<RegexPage />} />
        <Route path="sql" element={<SqlPage />} />
        <Route path="timestamp" element={<TimestampPage />} />
        <Route path="url" element={<UrlPage />} />
        <Route path="uuid" element={<UuidPage />} />
      </Route>
    </Routes>
  );
}; 