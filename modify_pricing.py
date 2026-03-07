import re
import codecs

with codecs.open("index.html", "r", "utf-8") as f:
    html = f.read()

# Replace the Planes de Costos block
old_pricing_re = re.compile(r'<!-- 5\. Planes de Costos -->\s*<section class="pricing" id="precios">.*?</section>', re.DOTALL)

new_pricing = '''<!-- 5. Planes de Costos -->
    <section class="pricing" id="precios" style="padding: 5rem 0; background: var(--color-bg);">
      <div class="container">
        
        <div style="text-align: center; max-width: 600px; margin: 0 auto 3rem;">
          <h2 class="section-title">Calculadora de Costos</h2>
          <p class="section-subtitle">Proyecta tu inversión. Sin pagos ocultos ni sorpresas.</p>
        </div>

        <div class="pricing-calc" style="max-width: 800px; margin: 0 auto; background: var(--color-white); border-radius: 20px; box-shadow: var(--shadow-lg); border: 1px solid var(--color-border); padding: 3rem;">
          
          <div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: flex-start;">
            <!-- Izquierda: Controles -->
            <div style="flex: 1; min-width: 300px;">
              <h3 style="margin-top: 0; margin-bottom: 1.5rem; font-size: 1.1rem; color: var(--color-text-muted);">Selecciona la cantidad de números:</h3>
              <div class="pricing-calc__presets" style="margin-bottom: 1.5rem;">
                <button type="button" class="preset-btn" data-qty="1000">1k</button>
                <button type="button" class="preset-btn" data-qty="10000">10k</button>
                <button type="button" class="preset-btn active" data-qty="20000">20k</button>
                <button type="button" class="preset-btn" data-qty="50000">50k</button>
              </div>
              
              <div class="pricing-calc__controls" style="margin-bottom: 1rem;">
                <button type="button" class="qty-btn" id="qtyMinus" aria-label="Menos">−</button>
                <input type="number" id="qtyInput" value="10000" min="1" max="100000" aria-label="Cantidad de números">
                <button type="button" class="qty-btn" id="qtyPlus" aria-label="Más">+</button>
              </div>
              
              <div class="pricing-calc__slider-wrap">
                <input type="range" id="qtySlider" min="100" max="50000" value="10000" step="100" class="pricing-calc__slider">
              </div>
            </div>

            <!-- Derecha: Resultados -->
            <div style="flex: 1; min-width: 300px; background: var(--color-bg-subtle); padding: 2rem; border-radius: 16px; text-align: center;">
              <p style="margin: 0 0 0.5rem; color: var(--color-text-muted); font-weight: 500;">Inversión Total</p>
              <div class="pricing-calc__result" style="margin-bottom: 0.5rem;">
                <span class="pricing-calc__price" id="displayPrice" style="color: var(--color-primary); font-size: 3rem;">159.00</span> <span style="font-size: 1.5rem; color: var(--color-text-muted); font-weight: 600;">USD</span>
              </div>
              <p class="pricing-calc__nums" style="margin-bottom: 1rem; font-size: 1.1rem;">Para <span id="displayNums" style="font-weight: 700; color: var(--color-text);">10,000</span> Números</p>
              
              <div style="display: inline-block; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); color: var(--color-success); border-radius: 999px; font-weight: 600; font-size: 0.95rem;">
                <span id="perNum">0.0159 USD</span> por boleto
              </div>
            </div>
          </div>

          <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--color-border);">
            <ul class="feature-modern-list" style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
              <li style="flex: 1; min-width: 200px;">Personalización de boletos</li>
              <li style="flex: 1; min-width: 200px;">Sistema de pagos integrado</li>
              <li style="flex: 1; min-width: 200px;">Soporte técnico dedicado</li>
            </ul>
            <div style="text-align: center; margin-top: 2rem;">
              <a href="#registro" class="btn btn--primary btn--lg">Comenzar Ahora</a>
            </div>
          </div>
        </div>

        <!-- Tabla detallada -->
        <div class="pricing-table-wrap" style="max-width: 1000px; margin: 4rem auto 0;">
          <h3 style="text-align: center; margin-bottom: 2rem; font-size: 1.8rem;">Tabla de Precios por Volumen</h3>
          <div class="pricing-table" role="table" style="box-shadow: var(--shadow-sm); border-radius: 16px; overflow: hidden; border: 1px solid var(--color-border);">
            <div class="pricing-table__row pricing-table__head" style="background: var(--color-bg-subtle); padding: 1.5rem;">
              <span style="font-weight: 700;">N° de Números</span>
              <span style="font-weight: 700;">Precio Total (Aprox.)</span>
              <span style="font-weight: 700;">Soporte</span>
            </div>
            <div class="pricing-table__row" style="padding: 1.25rem 1.5rem;"><span>1,000</span><span>$50.00 USD</span><span>Estándar</span></div>
            <div class="pricing-table__row" style="padding: 1.25rem 1.5rem;"><span>5,000</span><span>$125.00 USD</span><span>Estándar</span></div>
            <div class="pricing-table__row highlight" style="padding: 1.25rem 1.5rem; background: rgba(37,99,235,0.05); border-left: 4px solid var(--color-primary);"><span>10,000</span><span style="color: var(--color-primary); font-weight: 700;">$159.00 USD</span><span>Estándar</span></div>
            <div class="pricing-table__row" style="padding: 1.25rem 1.5rem;"><span>25,000</span><span>$300.00 USD</span><span>Prioritario</span></div>
            <div class="pricing-table__row" style="padding: 1.25rem 1.5rem;"><span>50,000+</span><span>Contactar Ventas</span><span>VIP 24/7</span></div>
          </div>
        </div>

        <!-- "Todo Incluido" -->
        <div style="margin-top: 5rem; text-align: center;">
          <h3 style="font-size: 1.8rem; margin-bottom: 2.5rem;">¿Qué incluye cada paquete?</h3>
          <div class="bento-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); text-align: left;">
            <div class="feature-item" style="background: var(--color-white); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 0.5rem; color: var(--color-primary); font-size: 1.1rem;">⚙️ Configuración inicial</h4>
              <p style="margin: 0; color: var(--color-text-muted); font-size: 0.95rem;">Panel para armar y configurar la rifa desde cero.</p>
            </div>
            <div class="feature-item" style="background: var(--color-white); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 0.5rem; color: var(--color-primary); font-size: 1.1rem;">🌐 Landing Page</h4>
              <p style="margin: 0; color: var(--color-text-muted); font-size: 0.95rem;">Una página web dedicada exclusiva para la venta.</p>
            </div>
            <div class="feature-item" style="background: var(--color-white); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 0.5rem; color: var(--color-primary); font-size: 1.1rem;">📊 Panel de Administración</h4>
              <p style="margin: 0; color: var(--color-text-muted); font-size: 0.95rem;">Para gestionar folios, clientes y opciones avanzadas.</p>
            </div>
            <div class="feature-item" style="background: var(--color-white); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 0.5rem; color: var(--color-primary); font-size: 1.1rem;">🎟️ Gestión de Boletos</h4>
              <p style="margin: 0; color: var(--color-text-muted); font-size: 0.95rem;">Sistema automático para asignar números rápida y seguramente.</p>
            </div>
            <div class="feature-item" style="background: var(--color-white); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 0.5rem; color: var(--color-primary); font-size: 1.1rem;">📈 Reportes en tiempo real</h4>
              <p style="margin: 0; color: var(--color-text-muted); font-size: 0.95rem;">Gráficas dinámicas y bases de datos exportables de ventas.</p>
            </div>
            <div class="feature-item" style="background: var(--color-white); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 0.5rem; color: var(--color-primary); font-size: 1.1rem;">💳 Múltiples Pagos</h4>
              <p style="margin: 0; color: var(--color-text-muted); font-size: 0.95rem;">Integración con diferentes métodos para recibir el dinero ágilmente.</p>
            </div>
          </div>
        </div>

      </div>
    </section>'''

html = old_pricing_re.sub(new_pricing, html)

with codecs.open("index.html", "w", "utf-8") as f:
    f.write(html)
