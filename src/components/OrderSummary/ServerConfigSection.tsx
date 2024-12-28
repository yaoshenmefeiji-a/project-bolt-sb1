import React from 'react';
import { Cpu, Memory, HardDrive, Terminal } from 'lucide-react';
import { ServerConfig } from '../../types/server';

interface ServerConfigSectionProps {
  config: ServerConfig;
}

export function ServerConfigSection({ config }: ServerConfigSectionProps) {
  const specs = [
    { icon: Cpu, label: '处理器', value: config.cpu },
    { icon: Memory, label: '内存', value: config.memory },
    { icon: HardDrive, label: '存储', value: config.storage },
    { icon: Terminal, label: '系统', value: config.os },
  ];

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">服务器配置</h3>
      <div className="grid grid-cols-2 gap-3">
        {specs.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-gray-400" />
            <div className="text-sm">
              <span className="text-gray-500">{label}:</span>{' '}
              <span className="text-gray-900">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}