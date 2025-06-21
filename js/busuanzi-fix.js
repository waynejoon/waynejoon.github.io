// 修复不蒜子统计在PJAX下不刷新的问题
document.addEventListener('DOMContentLoaded', function() {
    // 初始化函数
    function refreshBusuanzi() {
        console.log('尝试刷新不蒜子统计...');
        
        // 检查不蒜子脚本是否已加载
        if (typeof busuanzi === 'undefined') {
            console.log('不蒜子脚本未加载，重新加载脚本');
            // 重新加载不蒜子脚本
            loadBusuanziScript();
            return;
        }
        
        // 尝试刷新不蒜子统计
        try {
            busuanzi.fetch();
            console.log('不蒜子统计刷新成功');
            
            // 检查是否有数据，如果有则显示容器
            setTimeout(checkAndShowBusuanzi, 500);
        } catch (e) {
            console.log('不蒜子统计刷新失败:', e);
            // 如果刷新失败，重新加载脚本
            loadBusuanziScript();
        }
    }

    // 检查不蒜子数据并显示
    function checkAndShowBusuanzi() {
        // 页面访问量
        const pageElement = document.getElementById('busuanzi_value_page_pv');
        const pageContainer = document.getElementById('busuanzi_container_page_pv');
        
        // 网站访问量
        const siteElement = document.getElementById('busuanzi_value_site_uv');
        const siteContainer = document.getElementById('busuanzi_container_site_uv');
        
        // 检查页面访问量
        if (pageElement && pageContainer) {
            if (pageElement.textContent && pageElement.textContent !== '0' && pageElement.textContent !== '--') {
                pageContainer.style.display = 'inline';
                console.log('页面访问量显示成功:', pageElement.textContent);
            } else {
                console.log('页面访问量数据无效，继续等待');
                // 如果数据无效，再次尝试刷新
                setTimeout(refreshBusuanzi, 1000);
            }
        }
        
        // 检查网站访问量
        if (siteElement && siteContainer) {
            if (siteElement.textContent && siteElement.textContent !== '0' && siteElement.textContent !== '--') {
                siteContainer.style.display = 'inline';
                console.log('网站访问量显示成功:', siteElement.textContent);
            }
        }
    }

    // 加载不蒜子脚本的函数
    function loadBusuanziScript() {
        // 移除旧的脚本
        const oldScript = document.querySelector('script[src*="busuanzi"]');
        if (oldScript) {
            oldScript.remove();
        }

        // 添加新的脚本
        const script = document.createElement('script');
        script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
        script.async = true;
        script.onload = function() {
            console.log('不蒜子脚本重新加载完成');
            // 脚本加载完成后，等待一段时间再刷新数据
            setTimeout(function() {
                if (typeof busuanzi !== 'undefined') {
                    busuanzi.fetch();
                    setTimeout(checkAndShowBusuanzi, 500);
                }
            }, 500);
        };
        document.body.appendChild(script);
    }

    // 设置强制显示的超时
    setTimeout(function() {
        const pageContainer = document.getElementById('busuanzi_container_page_pv');
        const siteContainer = document.getElementById('busuanzi_container_site_uv');
        
        if (pageContainer) pageContainer.style.display = 'inline';
        if (siteContainer) siteContainer.style.display = 'inline';
        console.log('超时强制显示不蒜子统计');
    }, 5000);

    // 初始刷新
    setTimeout(refreshBusuanzi, 300);

    // 监听PJAX事件
    document.addEventListener('pjax:complete', function() {
        console.log('PJAX完成，刷新不蒜子统计');
        setTimeout(refreshBusuanzi, 300);
    });

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            console.log('页面变为可见，刷新不蒜子统计');
            setTimeout(refreshBusuanzi, 300);
        }
    });
    
    // 定期检查
    setInterval(checkAndShowBusuanzi, 2000);
});