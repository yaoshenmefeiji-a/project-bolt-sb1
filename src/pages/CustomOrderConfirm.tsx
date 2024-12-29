import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { STEPS } from '../constants/steps';
import { ArrowLeft, Info } from 'lucide-react';

interface DiscountCode {
  type: 'discount';
  value: number;
  name: string;
}

interface Voucher {
  type: 'voucher';
  value: number;
  name: string;
  minAmount: number;
}

// 优惠码配置
const DISCOUNT_CODES: Record<string, DiscountCode> = {
  'NEWYEAR': { type: 'discount', value: 0.88, name: '新年特惠' }, // 88折
  'SUMMER': { type: 'discount', value: 0.95, name: '夏季特惠' }, // 95折
};

// 代金券配置
const VOUCHERS: Record<string, Voucher> = {
  'GIFT100': { type: 'voucher', value: 100, name: '满1000减100', minAmount: 1000 },
  'GIFT500': { type: 'voucher', value: 500, name: '满5000减500', minAmount: 5000 },
};

export function CustomOrderConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const customFormData = location.state?.customFormData;
  const serverConfig = location.state?.serverConfig;
  const [couponCode, setCouponCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const steps = STEPS.map((step, index) => ({
    ...step,
    status: index === 2 ? 'current' as const : index < 2 ? 'completed' as const : 'upcoming' as const
  }));

  const handleBack = () => {
    navigate('/custom-order-info', {
      state: {
        customFormData
      }
    });
  };

  const handleSubmit = () => {
    // TODO: 处理订单提交
    console.log('提交定制订单');
  };

  // 验证并应用优惠码
  const validateCoupon = () => {
    setErrorMessage('');
    const code = couponCode.trim().toUpperCase();
    
    // 检查是否已经应用了优惠码
    if (appliedCode) {
      setErrorMessage('已经使用了优惠码，每个订单只能使用一个优惠码或代金券');
      return;
    }

    // 检查优惠码是否存在
    const discountCode = DISCOUNT_CODES[code];
    const voucher = VOUCHERS[code];

    if (!discountCode && !voucher) {
      setErrorMessage('无效的优惠码或代金券');
      return;
    }

    // 如果是代金券，检查订单金额是否满足最低要求
    if (voucher) {
      const budget = Number(customFormData?.budget || 0);
      if (budget < voucher.minAmount) {
        setErrorMessage(`订单金额未满${voucher.minAmount}元，无法使用该代金券`);
        return;
      }
    }

    // 应用优惠码
    setAppliedCode(code);
    setCouponCode('');
  };

  // 获取优惠码或代金券的显示信息
  const getAppliedCodeInfo = () => {
    if (!appliedCode) return null;

    const discountCode = DISCOUNT_CODES[appliedCode];
    if (discountCode) {
      return {
        name: discountCode.name,
        description: `${Math.round(discountCode.value * 100)}折`
      };
    }

    const voucher = VOUCHERS[appliedCode];
    if (voucher) {
      return {
        name: voucher.name,
        description: `满${voucher.minAmount}减${voucher.value}`
      };
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={steps} />
        
        <div className="mt-8 max-w-4xl mx-auto space-y-6">
          {/* 定制资源信息 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">定制订单IP资源信息</h3>
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">国家/地区</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.country || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">IP类型</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.usageType === 'native' ? '原生' : '广播'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">AS属性</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      ISP
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">业务名称</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.businessName === 'custom' 
                        ? customFormData?.customBusinessUrl 
                        : customFormData?.businessName || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">子网规模</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      /{customFormData?.subnetSize || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">月度预算</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      ¥{customFormData?.budget || '-'}/月
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">合约期</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.commitmentPeriod === '0' 
                        ? '无合约期' 
                        : `${customFormData?.commitmentPeriod || '-'}个月`}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">数据库交付标准</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.database || '-'}
                    </div>
                  </div>
                </div>
                {customFormData?.notes && (
                  <div>
                    <span className="text-sm text-gray-500">备注说明</span>
                    <div className="mt-1 text-sm text-gray-900">
                      {customFormData.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 服务器配置信息 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">预订订单服务器信息</h3>
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">操作系统</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {serverConfig?.os || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">CPU</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {serverConfig?.cpu || '-'} 核
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">内存</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {serverConfig?.memory || '-'} GB
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">系统盘</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {serverConfig?.systemDisk || '-'} GB
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">数据盘</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {serverConfig?.dataDisk || '-'} GB
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">带宽</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {serverConfig?.bandwidth || '-'} Mbps
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">防护</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {serverConfig?.protection || '-'} Gbps
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">付费方式</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {serverConfig?.paymentPeriod || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 交付时间 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-medium text-gray-900">交付时间</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">希望交付时间</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">建议的最早交付时间</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最迟交付时间</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">可接受的最晚交付时间</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-start gap-1.5">
                <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="leading-5">
                  我们将尽可能在您期望的时间内完成交付，如遇特殊情况会提前与您沟通
                </p>
              </div>
            </div>
          </div>

          {/* 优惠码/代金券输入框 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-medium text-gray-900">优惠码/代金券</h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="请输入优惠码或代金券码"
                  value={couponCode}
                  onChange={(e) => {
                    setErrorMessage('');
                    setCouponCode(e.target.value);
                  }}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={validateCoupon}
                  disabled={!couponCode.trim() || !!appliedCode}
                >
                  使用
                </button>
              </div>
              {errorMessage && (
                <div className="mt-2 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}
              {appliedCode && (
                <div className="mt-2 text-sm text-green-600 flex items-center justify-between">
                  <span>已使用：{getAppliedCodeInfo()?.name} ({getAppliedCodeInfo()?.description})</span>
                  <button
                    onClick={() => {
                      setAppliedCode(null);
                      setErrorMessage('');
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="mt-3 text-xs text-gray-500 flex items-start gap-1.5">
                <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="leading-5">
                  每个订单仅可使用一个优惠码或代金券，部分商品可能不参与优惠
                </p>
              </div>
            </div>
          </div>

          {/* 费用明细 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-medium text-gray-900">费用明细</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">IP资源月度费用</span>
                  <span className="font-medium">
                    ¥{customFormData?.budget || 0}/月
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">服务器月度费用</span>
                  <span className="font-medium">
                    ¥{serverConfig?.totalPrice || 0}/月
                  </span>
                </div>
                {appliedCode && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">
                        {DISCOUNT_CODES[appliedCode] ? '折扣码优惠' : '代金券优惠'}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({getAppliedCodeInfo()?.description})
                      </span>
                    </div>
                    <span className="font-medium text-red-600">
                      -¥{DISCOUNT_CODES[appliedCode] 
                        ? Math.round((Number(customFormData?.budget || 0) + Number(serverConfig?.totalPrice || 0)) * (1 - DISCOUNT_CODES[appliedCode].value))
                        : VOUCHERS[appliedCode]?.value || 0}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-900">订单总金额</span>
                    <div className="text-right">
                      <span className="text-xl font-semibold text-blue-600">
                        ¥{Math.round((Number(customFormData?.budget || 0) + Number(serverConfig?.totalPrice || 0)) * (
                          appliedCode && DISCOUNT_CODES[appliedCode] 
                            ? DISCOUNT_CODES[appliedCode].value 
                            : 1
                        )) - (appliedCode && VOUCHERS[appliedCode]?.value || 0)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        (按月付费)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              上一步
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              提交订单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 