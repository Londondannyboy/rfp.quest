import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ComparisonRow {
  feature: string;
  rfpquest: boolean | string;
  competitor1?: boolean | string;
  competitor2?: boolean | string;
}

interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  headers: string[];
  rows: ComparisonRow[];
}

export function ComparisonTable({ title, subtitle, headers, rows }: ComparisonTableProps) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon className="w-6 h-6 text-teal-500 mx-auto" />
      ) : (
        <XMarkIcon className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto" />
      );
    }
    return <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>;
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={`px-4 md:px-6 py-4 text-left ${
                      index === 0
                        ? 'text-gray-900 dark:text-white'
                        : 'text-center'
                    } ${
                      index === 1
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-bold'
                        : 'text-gray-600 dark:text-gray-400'
                    } text-sm md:text-base font-semibold border-b-2 border-gray-200 dark:border-gray-700`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 md:px-6 py-4 text-gray-900 dark:text-white font-medium">
                    {row.feature}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center bg-teal-50/50 dark:bg-teal-900/10">
                    {renderCell(row.rfpquest)}
                  </td>
                  {row.competitor1 !== undefined && (
                    <td className="px-4 md:px-6 py-4 text-center">
                      {renderCell(row.competitor1)}
                    </td>
                  )}
                  {row.competitor2 !== undefined && (
                    <td className="px-4 md:px-6 py-4 text-center">
                      {renderCell(row.competitor2)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
