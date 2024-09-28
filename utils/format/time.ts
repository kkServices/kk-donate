import dayjs from 'dayjs';

/**
 * 时间格式化
 * @param time 时间
 * @param template 格式化模板
 * @example
 * formatTime('YYYY-MM-DD HH:mm:ss') => '2021-01-01 12:00:00'
 */
function formatTime(time?: dayjs.ConfigType, template: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(time).format(template);
}

export { formatTime };
